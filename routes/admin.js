const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Escort = require('../models/Escort');
const Payment = require('../models/Payment');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/dashboard - Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const stats = await Promise.all([
      // User statistics
      User.countDocuments(),
      User.countDocuments({ role: 'member' }),
      User.countDocuments({ role: 'escort' }),
      User.countDocuments({ 'membership.isActive': true }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),

      // Escort statistics
      Escort.countDocuments(),
      Escort.countDocuments({ status: 'pending' }),
      Escort.countDocuments({ status: 'approved' }),
      Escort.countDocuments({ 'subscription.isActive': true }),
      Escort.countDocuments({ 'verification.isVerified': true }),

      // Payment statistics
      Payment.countDocuments({ status: 'completed' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      users: {
        total: stats[0],
        members: stats[1],
        escorts: stats[2],
        activeMembers: stats[3],
        newThisMonth: stats[4]
      },
      escorts: {
        total: stats[5],
        pending: stats[6],
        approved: stats[7],
        activeSubscriptions: stats[8],
        verified: stats[9]
      },
      payments: {
        totalTransactions: stats[10],
        totalRevenue: stats[11][0]?.total || 0,
        monthlyRevenue: stats[12][0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to get dashboard statistics' });
  }
});

// GET /api/admin/users - Get all users with pagination and filters
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['member', 'escort', 'admin']),
  query('status').optional().isIn(['active', 'inactive']),
  query('search').optional().trim().isLength({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status === 'active') filter.isActive = true;
    if (req.query.status === 'inactive') filter.isActive = false;
    
    if (req.query.search) {
      filter.$or = [
        { email: new RegExp(req.query.search, 'i') },
        { 'profile.firstName': new RegExp(req.query.search, 'i') },
        { 'profile.lastName': new RegExp(req.query.search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: users.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// GET /api/admin/users/:userId - Get specific user details
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get escort profile if user is an escort
    let escortProfile = null;
    if (user.role === 'escort') {
      escortProfile = await Escort.findOne({ userId: user._id });
    }

    // Get payment history
    const payments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-paymentDetails.gatewayResponse');

    res.json({
      user,
      escortProfile,
      recentPayments: payments
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Failed to get user details' });
  }
});

// PUT /api/admin/users/:userId/status - Update user status
router.put('/users/:userId/status', [
  body('isActive').isBoolean().withMessage('Active status must be boolean'),
  body('reason').optional().trim().isLength({ min: 1, max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = req.body.isActive;
    await user.save();

    res.json({
      message: `User ${req.body.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

// GET /api/admin/escorts - Get all escort profiles for review
router.get('/escorts', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['draft', 'pending', 'approved', 'rejected', 'suspended']),
  query('verified').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.verified !== undefined) filter['verification.isVerified'] = req.query.verified === 'true';

    const escorts = await Escort.find(filter)
      .populate('userId', 'email profile createdAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Escort.countDocuments(filter);

    res.json({
      escorts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: escorts.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get escorts for admin error:', error);
    res.status(500).json({ message: 'Failed to get escorts' });
  }
});

// GET /api/admin/escorts/:escortId - Get specific escort profile for review
router.get('/escorts/:escortId', async (req, res) => {
  try {
    const escort = await Escort.findById(req.params.escortId)
      .populate('userId', 'email profile createdAt lastLogin');

    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    res.json({ escort });

  } catch (error) {
    console.error('Get escort for admin error:', error);
    res.status(500).json({ message: 'Failed to get escort profile' });
  }
});

// PUT /api/admin/escorts/:escortId/status - Approve/reject escort profile
router.put('/escorts/:escortId/status', [
  body('status').isIn(['approved', 'rejected', 'suspended']).withMessage('Valid status required'),
  body('reason').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Reason must be 1-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const escort = await Escort.findById(req.params.escortId);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    const previousStatus = escort.status;
    escort.status = req.body.status;
    
    // Add admin note if reason provided
    if (req.body.reason) {
      escort.adminNotes = escort.adminNotes || [];
      escort.adminNotes.push({
        adminId: req.user._id,
        action: `Status changed from ${previousStatus} to ${req.body.status}`,
        reason: req.body.reason,
        timestamp: new Date()
      });
    }

    await escort.save();

    // Send notification email to escort (implement email service)
    // await sendStatusUpdateEmail(escort, req.body.status, req.body.reason);

    res.json({
      message: `Escort profile ${req.body.status} successfully`,
      escort: {
        id: escort._id,
        displayName: escort.displayName,
        status: escort.status
      }
    });

  } catch (error) {
    console.error('Update escort status error:', error);
    res.status(500).json({ message: 'Failed to update escort status' });
  }
});

// PUT /api/admin/escorts/:escortId/verify - Verify escort
router.put('/escorts/:escortId/verify', [
  body('isVerified').isBoolean().withMessage('Verification status must be boolean'),
  body('notes').optional().trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const escort = await Escort.findById(req.params.escortId);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    escort.verification.isVerified = req.body.isVerified;
    if (req.body.isVerified) {
      escort.verification.verifiedAt = new Date();
      escort.verification.verifiedBy = req.user._id;
    }

    if (req.body.notes) {
      escort.adminNotes = escort.adminNotes || [];
      escort.adminNotes.push({
        adminId: req.user._id,
        action: req.body.isVerified ? 'Verified' : 'Verification removed',
        reason: req.body.notes,
        timestamp: new Date()
      });
    }

    await escort.save();

    res.json({
      message: `Escort ${req.body.isVerified ? 'verified' : 'verification removed'} successfully`,
      escort: {
        id: escort._id,
        displayName: escort.displayName,
        isVerified: escort.verification.isVerified
      }
    });

  } catch (error) {
    console.error('Update escort verification error:', error);
    res.status(500).json({ message: 'Failed to update verification status' });
  }
});

// GET /api/admin/payments - Get all payments
router.get('/payments', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'completed', 'failed', 'cancelled', 'refunded']),
  query('type').optional().isIn(['membership', 'escort_subscription'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const payments = await Payment.find(filter)
      .populate('userId', 'email profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-paymentDetails.gatewayResponse');

    const total = await Payment.countDocuments(filter);

    res.json({
      payments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: payments.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get payments for admin error:', error);
    res.status(500).json({ message: 'Failed to get payments' });
  }
});

// GET /api/admin/analytics - Get platform analytics
router.get('/analytics', [
  query('period').optional().isIn(['week', 'month', 'quarter', 'year'])
], async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default: // month
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const analytics = await Promise.all([
      // User registrations over time
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Revenue over time
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Popular cities
      Escort.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$location.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      period,
      userRegistrations: analytics[0],
      revenue: analytics[1],
      popularCities: analytics[2]
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to get analytics' });
  }
});

// POST /api/admin/broadcast - Send broadcast notification
router.post('/broadcast', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
  body('audience').isIn(['all', 'members', 'escorts']).withMessage('Valid audience required'),
  body('type').optional().isIn(['info', 'warning', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message, audience, type = 'info' } = req.body;

    // Build user filter based on audience
    let userFilter = { isActive: true };
    if (audience === 'members') userFilter.role = 'member';
    if (audience === 'escorts') userFilter.role = 'escort';

    const users = await User.find(userFilter).select('email profile');

    // Here you would implement the actual email/notification sending
    // For now, just log the broadcast
    console.log(`Broadcasting to ${users.length} users:`, { title, message, type });

    res.json({
      message: 'Broadcast sent successfully',
      recipients: users.length,
      audience,
      type
    });

  } catch (error) {
    console.error('Send broadcast error:', error);
    res.status(500).json({ message: 'Failed to send broadcast' });
  }
});

module.exports = router;