const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Escort = require('../models/Escort');
const { authenticateToken, requireMembership } = require('../middleware/auth');
const router = express.Router();

// GET /api/members/profile - Get member profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      profile: user,
      membership: {
        isActive: user.hasActiveMembership(),
        ...user.membership
      }
    });

  } catch (error) {
    console.error('Get member profile error:', error);
    res.status(500).json({ message: 'Failed to get member profile' });
  }
});

// PUT /api/members/profile - Update member profile
router.put('/profile',
  authenticateToken,
  [
    body('profile.firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('profile.lastName').optional().trim().isLength({ min: 1, max: 50 }),
    body('profile.phone').optional().isMobilePhone('en-GB'),
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
        profile: req.user.profile,
        preferences: req.user.preferences
      });

    } catch (error) {
      console.error('Update member profile error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }
);

// GET /api/members/favorites - Get member's favorite escorts
router.get('/favorites', 
  authenticateToken,
  [query('page').optional().isInt({ min: 1 })],
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const skip = (page - 1) * limit;

      // Get user's favorites (stored in a separate collection or user document)
      // For now, we'll implement a simple version
      const favoriteIds = req.user.favorites || [];
      
      if (favoriteIds.length === 0) {
        return res.json({
          favorites: [],
          pagination: { current: 1, total: 0, count: 0, totalRecords: 0 }
        });
      }

      const favorites = await Escort.find({
        _id: { $in: favoriteIds },
        status: 'approved',
        'subscription.isActive': true,
        'subscription.endDate': { $gt: new Date() }
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'profile');

      const total = favoriteIds.length;
      const hasActiveMembership = req.user.hasActiveMembership();

      // Format response based on membership
      const formattedFavorites = favorites.map(escort => {
        const escortData = escort.toObject();
        
        if (!hasActiveMembership) {
          escortData.contact = escort.getContactInfo(false);
          escortData.photos = escort.getBlurredPhotos();
        }

        return escortData;
      });

      res.json({
        favorites: formattedFavorites,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: favorites.length,
          totalRecords: total
        }
      });

    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Failed to get favorites' });
    }
  }
);

// POST /api/members/favorites/:escortId - Add escort to favorites
router.post('/favorites/:escortId',
  authenticateToken,
  async (req, res) => {
    try {
      // Verify escort exists and is active
      const escort = await Escort.findById(req.params.escortId)
        .where({ 
          status: 'approved',
          'subscription.isActive': true,
          'subscription.endDate': { $gt: new Date() }
        });

      if (!escort) {
        return res.status(404).json({ message: 'Escort not found or not active' });
      }

      // Add to user's favorites if not already present
      if (!req.user.favorites) {
        req.user.favorites = [];
      }

      if (!req.user.favorites.includes(req.params.escortId)) {
        req.user.favorites.push(req.params.escortId);
        
        // Increment escort's favorite count
        escort.stats.favorites += 1;
        await escort.save();
      }

      await req.user.save();

      res.json({ 
        message: 'Added to favorites successfully',
        isFavorite: true
      });

    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({ message: 'Failed to add to favorites' });
    }
  }
);

// DELETE /api/members/favorites/:escortId - Remove escort from favorites
router.delete('/favorites/:escortId',
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.user.favorites || !req.user.favorites.includes(req.params.escortId)) {
        return res.status(404).json({ message: 'Escort not in favorites' });
      }

      // Remove from user's favorites
      req.user.favorites = req.user.favorites.filter(
        id => id.toString() !== req.params.escortId
      );

      // Decrement escort's favorite count
      const escort = await Escort.findById(req.params.escortId);
      if (escort && escort.stats.favorites > 0) {
        escort.stats.favorites -= 1;
        await escort.save();
      }

      await req.user.save();

      res.json({ 
        message: 'Removed from favorites successfully',
        isFavorite: false
      });

    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({ message: 'Failed to remove from favorites' });
    }
  }
);

// GET /api/members/favorites/:escortId/status - Check if escort is in favorites
router.get('/favorites/:escortId/status',
  authenticateToken,
  async (req, res) => {
    try {
      const isFavorite = req.user.favorites && 
                        req.user.favorites.includes(req.params.escortId);

      res.json({ isFavorite });

    } catch (error) {
      console.error('Check favorite status error:', error);
      res.status(500).json({ message: 'Failed to check favorite status' });
    }
  }
);

// GET /api/members/search-history - Get member's search history
router.get('/search-history',
  authenticateToken,
  async (req, res) => {
    try {
      // This would be implemented with a separate SearchHistory model
      // For now, return empty array
      res.json({
        searchHistory: [],
        message: 'Search history feature coming soon'
      });

    } catch (error) {
      console.error('Get search history error:', error);
      res.status(500).json({ message: 'Failed to get search history' });
    }
  }
);

// GET /api/members/recommendations - Get personalized escort recommendations
router.get('/recommendations',
  authenticateToken,
  requireMembership,
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;

      // Simple recommendation algorithm based on:
      // 1. User's location preferences
      // 2. Popular escorts
      // 3. Recently active escorts

      const filter = {
        status: 'approved',
        'subscription.isActive': true,
        'subscription.endDate': { $gt: new Date() }
      };

      // Add location filter if user has location preferences
      if (req.user.profile.city) {
        filter['location.city'] = new RegExp(req.user.profile.city, 'i');
      }

      const recommendations = await Escort.find(filter)
        .sort({ 'stats.views': -1, updatedAt: -1 })
        .limit(limit)
        .populate('userId', 'profile');

      // Format response for members
      const formattedRecommendations = recommendations.map(escort => {
        const escortData = escort.toObject();
        // Members can see full content
        return escortData;
      });

      res.json({
        recommendations: formattedRecommendations,
        algorithm: 'popularity_and_location',
        count: recommendations.length
      });

    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ message: 'Failed to get recommendations' });
    }
  }
);

// GET /api/members/membership - Get membership details
router.get('/membership', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('membership');
    
    const membershipDetails = {
      isActive: user.hasActiveMembership(),
      type: user.membership.type,
      startDate: user.membership.startDate,
      endDate: user.membership.endDate,
      autoRenew: user.membership.autoRenew,
      paymentId: user.membership.paymentId,
      daysRemaining: null,
      status: 'inactive'
    };

    if (membershipDetails.isActive && user.membership.endDate) {
      const now = new Date();
      const endDate = new Date(user.membership.endDate);
      const timeDiff = endDate.getTime() - now.getTime();
      membershipDetails.daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      membershipDetails.status = 'active';
    }

    res.json({ membership: membershipDetails });

  } catch (error) {
    console.error('Get membership details error:', error);
    res.status(500).json({ message: 'Failed to get membership details' });
  }
});

// POST /api/members/membership/cancel - Cancel membership auto-renewal
router.post('/membership/cancel',
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.user.membership.isActive) {
        return res.status(400).json({ message: 'No active membership to cancel' });
      }

      req.user.membership.autoRenew = false;
      await req.user.save();

      res.json({ 
        message: 'Membership auto-renewal cancelled successfully',
        membership: {
          isActive: req.user.membership.isActive,
          endDate: req.user.membership.endDate,
          autoRenew: false
        }
      });

    } catch (error) {
      console.error('Cancel membership error:', error);
      res.status(500).json({ message: 'Failed to cancel membership' });
    }
  }
);

// GET /api/members/activity - Get member activity log
router.get('/activity',
  authenticateToken,
  [query('page').optional().isInt({ min: 1 })],
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;

      // This would be implemented with a separate ActivityLog model
      // For now, return basic activity data
      const activities = [
        {
          type: 'login',
          description: 'Logged in',
          timestamp: req.user.lastLogin || req.user.createdAt
        },
        {
          type: 'registration',
          description: 'Account created',
          timestamp: req.user.createdAt
        }
      ];

      res.json({
        activities,
        pagination: {
          current: page,
          total: 1,
          count: activities.length,
          totalRecords: activities.length
        }
      });

    } catch (error) {
      console.error('Get member activity error:', error);
      res.status(500).json({ message: 'Failed to get activity log' });
    }
  }
);

// GET /api/members/stats - Get member statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      favorites: (req.user.favorites || []).length,
      memberSince: req.user.createdAt,
      lastLogin: req.user.lastLogin,
      profileViews: 0, // This would be tracked separately
      searchCount: 0   // This would be tracked separately
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({ message: 'Failed to get member statistics' });
  }
});

module.exports = router;