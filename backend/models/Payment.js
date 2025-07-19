const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['subscription', 'premium_listing', 'featured_ad', 'top_placement', 'credits'],
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
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cryptocurrency'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripePaymentIntentId: {
    type: String
  },
  stripeCustomerId: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    escort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Escort'
    },
    duration: Number, // in days
    features: [String],
    credits: Number
  },
  invoice: {
    number: String,
    url: String
  },
  refund: {
    amount: Number,
    reason: String,
    refundedAt: Date,
    refundId: String
  },
  failureReason: {
    type: String
  },
  processedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ transactionId: 1 });

// Generate invoice number
paymentSchema.pre('save', function(next) {
  if (!this.invoice.number && this.status === 'completed') {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoice.number = `PL-${year}${month}${day}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);