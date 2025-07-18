const mongoose = require('mongoose');

const escortSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 99
  },
  bio: {
    type: String,
    required: true,
    maxlength: 2000
  },
  location: {
    city: {
      type: String,
      required: true
    },
    postcode: {
      type: String,
      required: true
    },
    area: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    cloudinaryId: String,
    isMain: {
      type: Boolean,
      default: false
    },
    isBlurred: {
      type: Boolean,
      default: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rates: {
    hourly: {
      type: Number,
      required: true,
      min: 50
    },
    overnight: Number,
    weekly: Number,
    currency: {
      type: String,
      default: 'GBP'
    }
  },
  services: [{
    name: String,
    description: String,
    additionalRate: Number
  }],
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  contact: {
    phone: String,
    whatsapp: String,
    telegram: String,
    email: String,
    website: String
  },
  preferences: {
    outcall: {
      type: Boolean,
      default: true
    },
    incall: {
      type: Boolean,
      default: true
    },
    minimumBooking: {
      type: Number,
      default: 1
    },
    advanceNotice: {
      type: Number,
      default: 2
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [{
      type: String,
      url: String,
      uploadedAt: Date
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'suspended'],
    default: 'draft'
  },
  subscription: {
    isActive: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    paymentId: String,
    autoRenew: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    contacts: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  },
  seo: {
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
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

// Indexes for performance
escortSchema.index({ userId: 1 });
escortSchema.index({ 'location.city': 1 });
escortSchema.index({ 'location.postcode': 1 });
escortSchema.index({ status: 1 });
escortSchema.index({ 'subscription.isActive': 1 });
escortSchema.index({ 'verification.isVerified': 1 });
escortSchema.index({ createdAt: -1 });
escortSchema.index({ 'stats.views': -1 });

// Generate SEO slug before saving
escortSchema.pre('save', function(next) {
  if (this.isModified('displayName') || !this.seo.slug) {
    this.seo.slug = this.displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

// Check if escort has active subscription
escortSchema.methods.hasActiveSubscription = function() {
  return this.subscription.isActive && 
         this.subscription.endDate && 
         this.subscription.endDate > new Date();
};

// Get main photo
escortSchema.methods.getMainPhoto = function() {
  return this.photos.find(photo => photo.isMain) || this.photos[0];
};

// Get blurred photos for non-members
escortSchema.methods.getBlurredPhotos = function() {
  return this.photos.map(photo => ({
    ...photo.toObject(),
    url: photo.isBlurred ? this.generateBlurredUrl(photo.url) : photo.url
  }));
};

// Generate blurred photo URL
escortSchema.methods.generateBlurredUrl = function(originalUrl) {
  // This would integrate with your image processing service
  // For now, return a placeholder or blurred version
  return originalUrl.replace('/upload/', '/upload/e_blur:2000/');
};

// Check if escort is visible to public
escortSchema.methods.isVisible = function() {
  return this.status === 'approved' && 
         this.hasActiveSubscription();
};

// Increment view count
escortSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  this.stats.lastViewed = new Date();
  return this.save();
};

// Get contact info for members only
escortSchema.methods.getContactInfo = function(userIsMember = false) {
  if (!userIsMember) {
    return {
      message: 'Contact information available to members only'
    };
  }
  return this.contact;
};

module.exports = mongoose.model('Escort', escortSchema);