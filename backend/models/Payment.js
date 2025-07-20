const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  escort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escort'
  },
  type: {
    type: String,
    enum: ['premium_subscription', 'featured_listing', 'verification', 'ad_boost'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'GBP'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'crypto'],
    required: true
  },
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  paypalOrderId: String,
  transactionId: String,
  description: String,
  duration: {
    type: Number, // Duration in days
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly']
  },
  nextPaymentDate: Date,
  metadata: {
    ip: String,
    userAgent: String,
    country: String
  },
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    stripeRefundId: String
  },
  invoice: {
    invoiceNumber: String,
    invoiceUrl: String,
    downloadUrl: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ escort: 1, type: 1, status: 1 });
paymentSchema.index({ status: 1, endDate: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

// Calculate end date before saving
paymentSchema.pre('save', function(next) {
  if (this.isNew && this.duration) {
    this.endDate = new Date(this.startDate.getTime() + (this.duration * 24 * 60 * 60 * 1000));
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);