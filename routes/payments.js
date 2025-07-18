const express = require('express');
const paypal = require('paypal-rest-sdk');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Escort = require('../models/Escort');
const { authenticateToken, requireEscort } = require('../middleware/auth');
const router = express.Router();

// Configure PayPal SDK
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Pricing configuration
const PRICING = {
  membership: {
    monthly: { amount: 29.99, currency: 'GBP', description: 'Monthly Premium Membership' },
    yearly: { amount: 299.99, currency: 'GBP', description: 'Yearly Premium Membership' }
  },
  escort_subscription: {
    basic: { amount: 49.99, currency: 'GBP', description: 'Basic Escort Listing - Monthly' },
    premium: { amount: 99.99, currency: 'GBP', description: 'Premium Escort Listing - Monthly' },
    vip: { amount: 199.99, currency: 'GBP', description: 'VIP Escort Listing - Monthly' }
  }
};

// Payment validation
const paymentValidation = [
  body('type').isIn(['membership', 'escort_subscription']).withMessage('Valid payment type required'),
  body('plan').notEmpty().withMessage('Payment plan required'),
  body('returnUrl').isURL().withMessage('Valid return URL required'),
  body('cancelUrl').isURL().withMessage('Valid cancel URL required')
];

// GET /api/payments/plans - Get available pricing plans
router.get('/plans', (req, res) => {
  try {
    res.json({
      membership: PRICING.membership,
      escort_subscription: PRICING.escort_subscription
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Failed to get pricing plans' });
  }
});

// POST /api/payments/create - Create PayPal payment
router.post('/create',
  authenticateToken,
  paymentValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { type, plan, returnUrl, cancelUrl } = req.body;

      // Validate plan exists
      if (!PRICING[type] || !PRICING[type][plan]) {
        return res.status(400).json({ message: 'Invalid payment plan' });
      }

      // Additional validation for escort subscriptions
      if (type === 'escort_subscription' && req.user.role !== 'escort') {
        return res.status(403).json({ message: 'Escort role required for escort subscriptions' });
      }

      const planData = PRICING[type][plan];

      // Create payment record
      const payment = new Payment({
        userId: req.user._id,
        type,
        plan,
        amount: planData.amount,
        currency: planData.currency,
        description: planData.description,
        status: 'pending',
        method: 'paypal',
        metadata: {
          subscriptionType: plan,
          duration: type === 'membership' && plan === 'yearly' ? 'yearly' : 'monthly',
          isRecurring: true,
          recurringInterval: plan === 'yearly' ? 'year' : 'month'
        }
      });

      await payment.save();

      // Create PayPal payment
      const paypalPayment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: {
          return_url: `${returnUrl}?paymentId=${payment.paymentId}`,
          cancel_url: `${cancelUrl}?paymentId=${payment.paymentId}`
        },
        transactions: [{
          item_list: {
            items: [{
              name: planData.description,
              sku: `${type}_${plan}`,
              price: planData.amount.toString(),
              currency: planData.currency,
              quantity: 1
            }]
          },
          amount: {
            currency: planData.currency,
            total: planData.amount.toString()
          },
          description: planData.description,
          custom: payment.paymentId
        }]
      };

      paypal.payment.create(paypalPayment, (error, paypalResponse) => {
        if (error) {
          console.error('PayPal payment creation error:', error);
          return res.status(500).json({ message: 'Failed to create PayPal payment' });
        }

        // Save PayPal payment ID
        payment.paypalPaymentId = paypalResponse.id;
        payment.save();

        // Find approval URL
        const approvalUrl = paypalResponse.links.find(link => link.rel === 'approval_url');

        res.json({
          paymentId: payment.paymentId,
          paypalPaymentId: paypalResponse.id,
          approvalUrl: approvalUrl ? approvalUrl.href : null,
          amount: planData.amount,
          currency: planData.currency,
          description: planData.description
        });
      });

    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({ message: 'Failed to create payment' });
    }
  }
);

// POST /api/payments/execute - Execute PayPal payment after approval
router.post('/execute',
  authenticateToken,
  [
    body('paymentId').notEmpty().withMessage('Payment ID required'),
    body('payerId').notEmpty().withMessage('Payer ID required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { paymentId, payerId } = req.body;

      // Find payment record
      const payment = await Payment.findOne({ 
        paymentId,
        userId: req.user._id,
        status: 'pending'
      });

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found or already processed' });
      }

      // Execute PayPal payment
      const executePayment = {
        payer_id: payerId
      };

      paypal.payment.execute(payment.paypalPaymentId, executePayment, async (error, paypalResponse) => {
        if (error) {
          console.error('PayPal payment execution error:', error);
          payment.status = 'failed';
          payment.paymentDetails.gatewayResponse = error;
          await payment.save();
          return res.status(500).json({ message: 'Payment execution failed' });
        }

        try {
          // Update payment record
          payment.status = 'completed';
          payment.processedAt = new Date();
          payment.paypalPayerId = payerId;
          payment.paymentDetails.transactionId = paypalResponse.transactions[0].related_resources[0].sale.id;
          payment.paymentDetails.gatewayResponse = paypalResponse;

          // Calculate subscription dates
          const startDate = new Date();
          const endDate = new Date();
          
          if (payment.metadata.duration === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
          } else {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          payment.metadata.startDate = startDate;
          payment.metadata.endDate = endDate;

          await payment.save();

          // Update user subscription based on payment type
          if (payment.type === 'membership') {
            // Update user membership
            req.user.membership = {
              isActive: true,
              type: payment.plan,
              startDate,
              endDate,
              paymentId: payment.paymentId,
              autoRenew: true
            };
            await req.user.save();

          } else if (payment.type === 'escort_subscription') {
            // Update escort subscription
            const escort = await Escort.findOne({ userId: req.user._id });
            if (escort) {
              escort.subscription = {
                isActive: true,
                type: payment.plan,
                startDate,
                endDate,
                paymentId: payment.paymentId,
                autoRenew: true
              };
              await escort.save();
            }
          }

          res.json({
            message: 'Payment completed successfully',
            payment: {
              id: payment.paymentId,
              type: payment.type,
              plan: payment.plan,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              startDate,
              endDate
            }
          });

        } catch (dbError) {
          console.error('Database update error after payment:', dbError);
          res.status(500).json({ message: 'Payment processed but subscription update failed' });
        }
      });

    } catch (error) {
      console.error('Execute payment error:', error);
      res.status(500).json({ message: 'Failed to execute payment' });
    }
  }
);

// GET /api/payments/history - Get user's payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-paymentDetails.gatewayResponse -billing');

    const total = await Payment.countDocuments({ userId: req.user._id });

    const formattedPayments = payments.map(payment => ({
      id: payment.paymentId,
      type: payment.type,
      plan: payment.plan,
      amount: payment.getFormattedAmount(),
      status: payment.status,
      description: payment.description,
      createdAt: payment.createdAt,
      processedAt: payment.processedAt,
      metadata: payment.metadata
    }));

    res.json({
      payments: formattedPayments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: payments.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Failed to get payment history' });
  }
});

// GET /api/payments/:paymentId - Get specific payment details
router.get('/:paymentId', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      paymentId: req.params.paymentId,
      userId: req.user._id 
    }).select('-paymentDetails.gatewayResponse');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      payment: {
        id: payment.paymentId,
        type: payment.type,
        plan: payment.plan,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        method: payment.method,
        createdAt: payment.createdAt,
        processedAt: payment.processedAt,
        metadata: payment.metadata,
        invoice: payment.invoice,
        isRefundable: payment.isRefundable()
      }
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Failed to get payment details' });
  }
});

// POST /api/payments/:paymentId/cancel - Cancel pending payment
router.post('/:paymentId/cancel', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      paymentId: req.params.paymentId,
      userId: req.user._id,
      status: 'pending'
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pending payment not found' });
    }

    payment.status = 'cancelled';
    await payment.save();

    res.json({ message: 'Payment cancelled successfully' });

  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({ message: 'Failed to cancel payment' });
  }
});

// POST /api/payments/webhook - PayPal webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook signature (implement webhook verification)
    const event = req.body;

    switch (event.event_type) {
      case 'PAYMENT.SALE.COMPLETED':
        // Handle successful payment
        await handlePaymentCompleted(event);
        break;
      case 'PAYMENT.SALE.DENIED':
        // Handle failed payment
        await handlePaymentFailed(event);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Handle subscription cancellation
        await handleSubscriptionCancelled(event);
        break;
      default:
        console.log('Unhandled webhook event:', event.event_type);
    }

    res.status(200).send('OK');

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Helper function to handle payment completion
async function handlePaymentCompleted(event) {
  try {
    const saleId = event.resource.id;
    const customData = event.resource.custom;

    if (customData) {
      const payment = await Payment.findOne({ paymentId: customData });
      if (payment && payment.status === 'pending') {
        payment.status = 'completed';
        payment.processedAt = new Date();
        await payment.save();
        
        // Update user subscription as needed
        console.log('Payment completed via webhook:', payment.paymentId);
      }
    }
  } catch (error) {
    console.error('Error handling payment completion:', error);
  }
}

// Helper function to handle payment failure
async function handlePaymentFailed(event) {
  try {
    const customData = event.resource.custom;

    if (customData) {
      const payment = await Payment.findOne({ paymentId: customData });
      if (payment && payment.status === 'pending') {
        payment.status = 'failed';
        await payment.save();
        
        console.log('Payment failed via webhook:', payment.paymentId);
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Helper function to handle subscription cancellation
async function handleSubscriptionCancelled(event) {
  try {
    // Implementation depends on subscription management setup
    console.log('Subscription cancelled via webhook:', event.resource.id);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

// GET /api/payments/subscription/status - Get current subscription status
router.get('/subscription/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let escortSubscription = null;

    if (req.user.role === 'escort') {
      const escort = await Escort.findOne({ userId: req.user._id });
      escortSubscription = escort ? escort.subscription : null;
    }

    res.json({
      membership: {
        isActive: user.hasActiveMembership(),
        ...user.membership
      },
      escortSubscription: escortSubscription ? {
        isActive: escortSubscription.isActive && escortSubscription.endDate > new Date(),
        ...escortSubscription
      } : null
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ message: 'Failed to get subscription status' });
  }
});

module.exports = router;