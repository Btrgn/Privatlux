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
    trim: true,
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
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['helpful', 'not_helpful']
    }
  }],
  reported: {
    type: Number,
    default: 0
  },
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'fake', 'spam', 'offensive', 'other']
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  moderationNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ escort: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ status: 1 });

// Prevent duplicate reviews from same user for same escort
reviewSchema.index({ escort: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);