const express = require('express');
const Payment = require('../models/Payment');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get user payments
router.get('/my-payments', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { type, amount, description } = req.body;

    const payment = new Payment({
      user: req.user.userId,
      type,
      amount,
      description,
      paymentMethod: 'stripe'
    });

    await payment.save();
    res.status(201).json({ message: 'Payment created', payment });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;