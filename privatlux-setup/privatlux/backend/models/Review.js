const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  escort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escort',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  categories: {
    appearance: {
      type: Number,
      min: 1,
      max: 5
    },
    service: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    location: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  serviceType: {
    type: String,
    enum: ['Incall', 'Outcall'],
    required: true
  },
  duration: {
    type: String,
    enum: ['30min', '1hour', '2hours', 'Overnight', 'Other']
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  moderationNotes: String,
  isHidden: {
    type: Boolean,
    default: false
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

// Ensure one review per user per escort
reviewSchema.index({ escort: 1, reviewer: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ escort: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });

// Update timestamp on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Review', reviewSchema);