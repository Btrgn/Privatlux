const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Escort = require('../models/Escort');
const User = require('../models/User');
const { 
  authenticateToken, 
  optionalAuth, 
  requireEscort, 
  requireMembership, 
  requireOwnership,
  requireAdmin 
} = require('../middleware/auth');
const router = express.Router();

// Validation schemas
const escortProfileValidation = [
  body('displayName').trim().isLength({ min: 2, max: 50 }).withMessage('Display name must be 2-50 characters'),
  body('age').isInt({ min: 18, max: 99 }).withMessage('Age must be between 18 and 99'),
  body('bio').trim().isLength({ min: 50, max: 2000 }).withMessage('Bio must be 50-2000 characters'),
  body('location.city').trim().isLength({ min: 1, max: 100 }).withMessage('City is required'),
  body('location.postcode').trim().isLength({ min: 1, max: 20 }).withMessage('Postcode is required'),
  body('rates.hourly').isFloat({ min: 50 }).withMessage('Hourly rate must be at least £50'),
  body('rates.overnight').optional().isFloat({ min: 100 }),
  body('rates.weekly').optional().isFloat({ min: 500 }),
  body('contact.phone').optional().isMobilePhone('en-GB'),
  body('contact.email').optional().isEmail(),
  body('preferences.outcall').optional().isBoolean(),
  body('preferences.incall').optional().isBoolean(),
  body('preferences.minimumBooking').optional().isInt({ min: 1, max: 24 }),
  body('preferences.advanceNotice').optional().isInt({ min: 1, max: 168 })
];

const searchValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  query('city').optional().trim().isLength({ min: 1, max: 100 }),
  query('postcode').optional().trim().isLength({ min: 1, max: 20 }),
  query('minRate').optional().isFloat({ min: 0 }),
  query('maxRate').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['newest', 'oldest', 'price_low', 'price_high', 'popular']),
  query('verified').optional().isBoolean()
];

// GET /api/escorts - Get all approved escorts with pagination and filters
router.get('/', 
  optionalAuth,
  searchValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      // Build filter query
      const filter = { 
        status: 'approved',
        'subscription.isActive': true,
        'subscription.endDate': { $gt: new Date() }
      };

      if (req.query.city) {
        filter['location.city'] = new RegExp(req.query.city, 'i');
      }
      
      if (req.query.postcode) {
        filter['location.postcode'] = new RegExp(req.query.postcode, 'i');
      }

      if (req.query.minRate || req.query.maxRate) {
        filter['rates.hourly'] = {};
        if (req.query.minRate) filter['rates.hourly'].$gte = parseFloat(req.query.minRate);
        if (req.query.maxRate) filter['rates.hourly'].$lte = parseFloat(req.query.maxRate);
      }

      if (req.query.verified === 'true') {
        filter['verification.isVerified'] = true;
      }

      // Build sort query
      let sort = {};
      switch (req.query.sortBy) {
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'price_low':
          sort = { 'rates.hourly': 1 };
          break;
        case 'price_high':
          sort = { 'rates.hourly': -1 };
          break;
        case 'popular':
          sort = { 'stats.views': -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }

      const escorts = await Escort.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email profile')
        .select('-contact -userId.email');

      const total = await Escort.countDocuments(filter);
      const hasActiveMembership = req.user && req.user.hasActiveMembership();

      // Format response based on membership status
      const formattedEscorts = escorts.map(escort => {
        const escortData = escort.toObject();
        
        // Always remove sensitive contact info for list view
        delete escortData.contact;
        
        // Show blurred photos for non-members
        if (!hasActiveMembership) {
          escortData.photos = escort.getBlurredPhotos();
        }

        return escortData;
      });

      res.json({
        escorts: formattedEscorts,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: escorts.length,
          totalRecords: total
        },
        filters: {
          city: req.query.city,
          postcode: req.query.postcode,
          minRate: req.query.minRate,
          maxRate: req.query.maxRate,
          verified: req.query.verified,
          sortBy: req.query.sortBy
        }
      });

    } catch (error) {
      console.error('Get escorts error:', error);
      res.status(500).json({ message: 'Failed to get escorts' });
    }
  }
);

// GET /api/escorts/:id - Get single escort profile
router.get('/:id', 
  optionalAuth,
  async (req, res) => {
    try {
      const escort = await Escort.findById(req.params.id)
        .populate('userId', 'profile')
        .where({ 
          status: 'approved',
          'subscription.isActive': true,
          'subscription.endDate': { $gt: new Date() }
        });

      if (!escort) {
        return res.status(404).json({ message: 'Escort not found' });
      }

      // Increment view count
      await escort.incrementViews();

      const hasActiveMembership = req.user && req.user.hasActiveMembership();
      const escortData = escort.toObject();

      // Hide contact info for non-members
      if (!hasActiveMembership) {
        escortData.contact = escort.getContactInfo(false);
        escortData.photos = escort.getBlurredPhotos();
      }

      res.json({
        escort: escortData,
        canViewContact: hasActiveMembership,
        membershipRequired: !hasActiveMembership
      });

    } catch (error) {
      console.error('Get escort error:', error);
      res.status(500).json({ message: 'Failed to get escort profile' });
    }
  }
);

// GET /api/escorts/profile/my - Get escort's own profile
router.get('/profile/my', 
  authenticateToken,
  requireEscort,
  async (req, res) => {
    try {
      const escort = await Escort.findOne({ userId: req.user._id })
        .populate('userId', 'email profile membership');

      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      res.json({ escort });

    } catch (error) {
      console.error('Get my escort profile error:', error);
      res.status(500).json({ message: 'Failed to get profile' });
    }
  }
);

// POST /api/escorts/profile - Create escort profile
router.post('/profile', 
  authenticateToken,
  requireEscort,
  escortProfileValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      // Check if escort profile already exists
      const existingEscort = await Escort.findOne({ userId: req.user._id });
      if (existingEscort) {
        return res.status(400).json({ message: 'Escort profile already exists' });
      }

      const escortData = {
        userId: req.user._id,
        ...req.body,
        status: 'draft'
      };

      const escort = new Escort(escortData);
      await escort.save();

      res.status(201).json({
        message: 'Escort profile created successfully',
        escort
      });

    } catch (error) {
      console.error('Create escort profile error:', error);
      res.status(500).json({ message: 'Failed to create profile' });
    }
  }
);

// PUT /api/escorts/profile - Update escort profile
router.put('/profile', 
  authenticateToken,
  requireEscort,
  escortProfileValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      // Update allowed fields
      const allowedUpdates = [
        'displayName', 'age', 'bio', 'location', 'rates', 
        'services', 'availability', 'contact', 'preferences'
      ];

      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          escort[field] = req.body[field];
        }
      });

      // If significant changes are made, require re-approval
      const significantFields = ['displayName', 'age', 'location', 'rates'];
      const hasSignificantChanges = significantFields.some(field => req.body[field] !== undefined);
      
      if (hasSignificantChanges && escort.status === 'approved') {
        escort.status = 'pending';
      }

      await escort.save();

      res.json({
        message: 'Profile updated successfully',
        escort,
        requiresApproval: hasSignificantChanges && escort.status === 'pending'
      });

    } catch (error) {
      console.error('Update escort profile error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }
);

// POST /api/escorts/profile/submit - Submit profile for approval
router.post('/profile/submit', 
  authenticateToken,
  requireEscort,
  async (req, res) => {
    try {
      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      if (escort.status !== 'draft' && escort.status !== 'rejected') {
        return res.status(400).json({ message: 'Profile cannot be submitted in current status' });
      }

      // Validate required fields
      const requiredFields = ['displayName', 'age', 'bio', 'location.city', 'location.postcode', 'rates.hourly'];
      const missingFields = [];

      requiredFields.forEach(field => {
        const fieldPath = field.split('.');
        let value = escort;
        fieldPath.forEach(path => {
          value = value && value[path];
        });
        if (!value) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: 'Missing required fields', 
          missingFields 
        });
      }

      if (!escort.photos || escort.photos.length === 0) {
        return res.status(400).json({ message: 'At least one photo is required' });
      }

      escort.status = 'pending';
      await escort.save();

      res.json({
        message: 'Profile submitted for approval',
        escort
      });

    } catch (error) {
      console.error('Submit escort profile error:', error);
      res.status(500).json({ message: 'Failed to submit profile' });
    }
  }
);

// GET /api/escorts/cities - Get list of cities with escort count
router.get('/meta/cities', async (req, res) => {
  try {
    const cities = await Escort.aggregate([
      {
        $match: { 
          status: 'approved',
          'subscription.isActive': true,
          'subscription.endDate': { $gt: new Date() }
        }
      },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 50
      }
    ]);

    res.json({ cities });

  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Failed to get cities' });
  }
});

// GET /api/escorts/stats - Get escort statistics
router.get('/meta/stats', async (req, res) => {
  try {
    const totalEscorts = await Escort.countDocuments({ 
      status: 'approved',
      'subscription.isActive': true,
      'subscription.endDate': { $gt: new Date() }
    });

    const verifiedEscorts = await Escort.countDocuments({ 
      status: 'approved',
      'subscription.isActive': true,
      'subscription.endDate': { $gt: new Date() },
      'verification.isVerified': true
    });

    const rateStats = await Escort.aggregate([
      {
        $match: { 
          status: 'approved',
          'subscription.isActive': true,
          'subscription.endDate': { $gt: new Date() }
        }
      },
      {
        $group: {
          _id: null,
          avgRate: { $avg: '$rates.hourly' },
          minRate: { $min: '$rates.hourly' },
          maxRate: { $max: '$rates.hourly' }
        }
      }
    ]);

    res.json({
      totalEscorts,
      verifiedEscorts,
      rates: rateStats[0] || { avgRate: 0, minRate: 0, maxRate: 0 }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to get statistics' });
  }
});

// POST /api/escorts/:id/contact - Contact escort (members only)
router.post('/:id/contact',
  authenticateToken,
  requireMembership,
  [
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters'),
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('phone').optional().isMobilePhone('en-GB')
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

      const escort = await Escort.findById(req.params.id)
        .populate('userId', 'email profile')
        .where({ 
          status: 'approved',
          'subscription.isActive': true,
          'subscription.endDate': { $gt: new Date() }
        });

      if (!escort) {
        return res.status(404).json({ message: 'Escort not found' });
      }

      // Increment contact count
      escort.stats.contacts += 1;
      await escort.save();

      // Here you would implement email/SMS notification to the escort
      // For now, just return success

      res.json({
        message: 'Contact request sent successfully',
        contactInfo: escort.getContactInfo(true)
      });

    } catch (error) {
      console.error('Contact escort error:', error);
      res.status(500).json({ message: 'Failed to send contact request' });
    }
  }
);

module.exports = router;