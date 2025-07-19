const mongoose = require('mongoose');

const escortSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stageName: {
    type: String,
    required: true,
    trim: true
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
  height: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  measurements: {
    bust: String,
    waist: String,
    hips: String
  },
  hairColor: {
    type: String,
    enum: ['blonde', 'brunette', 'black', 'red', 'grey', 'other']
  },
  eyeColor: {
    type: String,
    enum: ['blue', 'brown', 'green', 'hazel', 'grey', 'other']
  },
  ethnicity: {
    type: String,
    enum: ['caucasian', 'asian', 'african', 'latina', 'mixed', 'other']
  },
  nationality: {
    type: String,
    trim: true
  },
  languages: [{
    type: String,
    trim: true
  }],
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      trim: true
    },
    postcode: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  services: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    description: String
  }],
  availability: {
    incall: {
      type: Boolean,
      default: false
    },
    outcall: {
      type: Boolean,
      default: false
    },
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String,
      available: Boolean
    }]
  },
  pricing: {
    hourly: Number,
    twoHours: Number,
    overnight: Number,
    currency: {
      type: String,
      default: 'GBP'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    isProfile: {
      type: Boolean,
      default: false
    },
    caption: String,
    order: {
      type: Number,
      default: 0
    }
  }],
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    documents: [{
      type: String,
      url: String
    }]
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    bookings: {
      type: Number,
      default: 0
    }
  },
  reviews: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  premiumUntil: {
    type: Date
  },
  lastOnline: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
escortSchema.index({ 'location.city': 1 });
escortSchema.index({ age: 1 });
escortSchema.index({ status: 1 });
escortSchema.index({ featured: -1 });
escortSchema.index({ 'reviews.average': -1 });
escortSchema.index({ createdAt: -1 });

// Update statistics
escortSchema.methods.incrementViews = function() {
  this.statistics.views += 1;
  return this.save();
};

escortSchema.methods.updateLastOnline = function() {
  this.lastOnline = new Date();
  return this.save();
};

module.exports = mongoose.model('Escort', escortSchema);