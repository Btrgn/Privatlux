const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  paypalPaymentId: String,
  paypalPayerId: String,
  type: {
    type: String,
    enum: ['membership', 'escort_subscription'],
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GBP'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['paypal', 'stripe', 'bank_transfer'],
    default: 'paypal'
  },
  description: String,
  metadata: {
    subscriptionType: String,
    duration: String,
    startDate: Date,
    endDate: Date,
    isRecurring: Boolean,
    recurringInterval: String
  },
  paymentDetails: {
    gateway: String,
    transactionId: String,
    authorizationId: String,
    captureId: String,
    refundId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  billing: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  invoice: {
    number: String,
    url: String,
    sentAt: Date
  },
  refund: {
    amount: Number,
    reason: String,
    refundedAt: Date,
    refundId: String
  },
  processedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ 'metadata.endDate': 1 });

// Generate unique payment ID
paymentSchema.pre('save', function(next) {
  if (!this.paymentId) {
    this.paymentId = `PL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Generate invoice number
paymentSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.invoice.number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.invoice.number = `INV-${year}${month}${day}-${random}`;
  }
  next();
});

// Check if payment is successful
paymentSchema.methods.isSuccessful = function() {
  return this.status === 'completed';
};

// Check if payment is refundable
paymentSchema.methods.isRefundable = function() {
  const daysSincePayment = (Date.now() - this.processedAt) / (1000 * 60 * 60 * 24);
  return this.status === 'completed' && 
         !this.refund.refundedAt && 
         daysSincePayment <= 30; // 30 days refund policy
};

// Get payment summary
paymentSchema.methods.getSummary = function() {
  return {
    id: this.paymentId,
    type: this.type,
    plan: this.plan,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    method: this.method,
    createdAt: this.createdAt,
    processedAt: this.processedAt
  };
};

// Calculate tax (if applicable)
paymentSchema.methods.calculateTax = function(taxRate = 0.20) {
  return Math.round(this.amount * taxRate * 100) / 100;
};

// Get formatted amount
paymentSchema.methods.getFormattedAmount = function() {
  const symbols = {
    GBP: '£',
    USD: '$',
    EUR: '€'
  };
  const symbol = symbols[this.currency] || this.currency;
  return `${symbol}${this.amount.toFixed(2)}`;
};

module.exports = mongoose.model('Payment', paymentSchema);