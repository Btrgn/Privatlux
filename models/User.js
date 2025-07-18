const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['member', 'escort', 'admin'],
    default: 'member'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    dateOfBirth: Date,
    city: String,
    postcode: String
  },
  membership: {
    isActive: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    startDate: Date,
    endDate: Date,
    paymentId: String,
    autoRenew: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    privacyLevel: {
      type: String,
      enum: ['public', 'members', 'private'],
      default: 'members'
    }
  },
  gdprConsent: {
    type: Boolean,
    default: false
  },
  termsAccepted: {
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

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'membership.isActive': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if membership is active and not expired
userSchema.methods.hasActiveMembership = function() {
  return this.membership.isActive && 
         this.membership.endDate && 
         this.membership.endDate > new Date();
};

// Get user's display name
userSchema.methods.getDisplayName = function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.email.split('@')[0];
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);