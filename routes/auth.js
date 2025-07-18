const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, sensitiveOperationLimit, requireGDPRConsent } = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registration validation
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['member', 'escort']).withMessage('Valid role required'),
  body('gdprConsent').equals('true').withMessage('GDPR consent is required'),
  body('termsAccepted').equals('true').withMessage('Terms acceptance is required'),
  body('profile.firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('profile.lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('profile.phone').optional().isMobilePhone(),
  body('profile.dateOfBirth').optional().isISO8601().toDate(),
  body('profile.city').optional().trim().isLength({ min: 1, max: 100 }),
  body('profile.postcode').optional().trim().isLength({ min: 1, max: 20 })
];

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

// POST /api/auth/register
router.post('/register', 
  sensitiveOperationLimit(15 * 60 * 1000, 3), // 3 attempts per 15 minutes
  registerValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { email, password, role, gdprConsent, termsAccepted, profile } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user
      const user = new User({
        email,
        password,
        role,
        gdprConsent: gdprConsent === 'true',
        termsAccepted: termsAccepted === 'true',
        profile: profile || {},
        verificationToken: crypto.randomBytes(32).toString('hex')
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Send welcome email (implement email service)
      // await sendWelcomeEmail(user);

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          profile: user.profile
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  sensitiveOperationLimit(15 * 60 * 1000, 5), // 5 attempts per 15 minutes
  loginValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          hasActiveMembership: user.hasActiveMembership(),
          profile: user.profile
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  }
);

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        hasActiveMembership: req.user.hasActiveMembership(),
        profile: req.user.profile,
        membership: req.user.membership,
        preferences: req.user.preferences,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// PUT /api/auth/profile
router.put('/profile', 
  authenticateToken,
  requireGDPRConsent,
  [
    body('profile.firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('profile.lastName').optional().trim().isLength({ min: 1, max: 50 }),
    body('profile.phone').optional().isMobilePhone(),
    body('profile.city').optional().trim().isLength({ min: 1, max: 100 }),
    body('profile.postcode').optional().trim().isLength({ min: 1, max: 20 }),
    body('preferences.emailNotifications').optional().isBoolean(),
    body('preferences.privacyLevel').optional().isIn(['public', 'members', 'private'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { profile, preferences } = req.body;
      
      if (profile) {
        req.user.profile = { ...req.user.profile, ...profile };
      }
      
      if (preferences) {
        req.user.preferences = { ...req.user.preferences, ...preferences };
      }

      await req.user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          profile: req.user.profile,
          preferences: req.user.preferences
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }
);

// POST /api/auth/change-password
router.post('/change-password',
  authenticateToken,
  sensitiveOperationLimit(60 * 60 * 1000, 3), // 3 attempts per hour
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const isValidPassword = await req.user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      req.user.password = newPassword;
      await req.user.save();

      res.json({ message: 'Password changed successfully' });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  }
);

// POST /api/auth/forgot-password
router.post('/forgot-password',
  sensitiveOperationLimit(60 * 60 * 1000, 3), // 3 attempts per hour
  [body('email').isEmail().normalizeEmail().withMessage('Valid email required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { email } = req.body;
      const user = await User.findOne({ email });

      // Always respond with success for security
      if (!user) {
        return res.json({ message: 'If an account exists, password reset instructions have been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send reset email (implement email service)
      // await sendPasswordResetEmail(user, resetToken);

      res.json({ message: 'If an account exists, password reset instructions have been sent' });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Failed to process request' });
    }
  }
);

// POST /api/auth/reset-password
router.post('/reset-password',
  sensitiveOperationLimit(60 * 60 * 1000, 3), // 3 attempts per hour
  [
    body('token').notEmpty().withMessage('Reset token required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { token, password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Update password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: 'Password reset successful' });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  }
);

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// DELETE /api/auth/account
router.delete('/account',
  authenticateToken,
  sensitiveOperationLimit(24 * 60 * 60 * 1000, 1), // 1 attempt per day
  [body('password').notEmpty().withMessage('Password required for account deletion')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { password } = req.body;

      // Verify password
      const isValidPassword = await req.user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }

      // Soft delete - just deactivate the account
      req.user.isActive = false;
      req.user.email = `deleted_${Date.now()}_${req.user.email}`;
      await req.user.save();

      res.json({ message: 'Account deleted successfully' });

    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Failed to delete account' });
    }
  }
);

module.exports = router;