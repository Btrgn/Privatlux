const express = require('express');
const User = require('../models/User');
const Escort = require('../models/Escort');
const Review = require('../models/Review');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get dashboard stats
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEscorts = await Escort.countDocuments();
    const activeEscorts = await Escort.countDocuments({ status: 'active' });
    const pendingReviews = await Review.countDocuments({ status: 'pending' });

    res.json({
      stats: {
        totalUsers,
        totalEscorts,
        activeEscorts,
        pendingReviews
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;