const mongoose = require('mongoose');

const escortSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stageName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 65
  },
  location: {
    city: {
      type: String,
      required: true
    },
    area: String,
    postcode: String,
    country: {
      type: String,
      default: 'UK'
    }
  },
  physical: {
    height: String,
    weight: String,
    bodyType: {
      type: String,
      enum: ['Slim', 'Athletic', 'Average', 'Curvy', 'BBW', 'Other']
    },
    hairColor: {
      type: String,
      enum: ['Blonde', 'Brunette', 'Black', 'Red', 'Grey', 'Other']
    },
    eyeColor: {
      type: String,
      enum: ['Blue', 'Brown', 'Green', 'Hazel', 'Grey', 'Other']
    },
    ethnicity: {
      type: String,
      enum: ['White', 'Asian', 'Black', 'Mixed', 'Latin', 'Middle Eastern', 'Other']
    },
    bustSize: String,
    measurements: String
  },
  services: {
    incall: {
      available: {
        type: Boolean,
        default: false
      },
      rates: {
        '30min': Number,
        '1hour': Number,
        '2hours': Number,
        'overnight': Number
      }
    },
    outcall: {
      available: {
        type: Boolean,
        default: false
      },
      rates: {
        '1hour': Number,
        '2hours': Number,
        'overnight': Number
      }
    },
    specialServices: [String]
  },
  availability: {
    schedule: {
      monday: { available: Boolean, hours: String },
      tuesday: { available: Boolean, hours: String },
      wednesday: { available: Boolean, hours: String },
      thursday: { available: Boolean, hours: String },
      friday: { available: Boolean, hours: String },
      saturday: { available: Boolean, hours: String },
      sunday: { available: Boolean, hours: String }
    },
    notice: {
      type: String,
      enum: ['Same day', '1 hour', '2 hours', '24 hours', '48 hours'],
      default: '2 hours'
    }
  },
  images: [{
    url: String,
    isMain: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  contact: {
    phone: String,
    whatsapp: String,
    telegram: String,
    email: String,
    website: String
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verificationMethod: String,
    documents: [String]
  },
  premium: {
    isPremium: {
      type: Boolean,
      default: false
    },
    premiumUntil: Date,
    featuredUntil: Date
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  lastOnline: {
    type: Date,
    default: Date.now
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

// Text search index
escortSchema.index({
  stageName: 'text',
  description: 'text',
  'location.city': 'text'
});

// Geo index for location-based searches
escortSchema.index({ 'location.city': 1 });

// Premium and featured escorts should appear first
escortSchema.index({ 'premium.isPremium': -1, 'premium.featuredUntil': -1, createdAt: -1 });

// Update timestamp on save
escortSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Escort', escortSchema);