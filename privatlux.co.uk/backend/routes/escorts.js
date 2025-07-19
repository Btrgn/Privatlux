const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Escort = require('../models/Escort');
const User = require('../models/User');
const { auth, escortAuth } = require('../middleware/auth');

const router = express.Router();

// Get all escorts with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('city').optional().trim(),
  query('minAge').optional().isInt({ min: 18, max: 65 }),
  query('maxAge').optional().isInt({ min: 18, max: 65 }),
  query('bodyType').optional().trim(),
  query('ethnicity').optional().trim(),
  query('services').optional().trim(),
  query('sortBy').optional().isIn(['createdAt', 'rating', 'views', 'premium']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      city,
      minAge,
      maxAge,
      bodyType,
      ethnicity,
      services,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true,
      isApproved: true
    };

    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }

    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }

    if (bodyType) {
      filter['physical.bodyType'] = bodyType;
    }

    if (ethnicity) {
      filter['physical.ethnicity'] = ethnicity;
    }

    if (services) {
      filter['services.specialServices'] = new RegExp(services, 'i');
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'premium') {
      sort['premium.isPremium'] = -1;
      sort['premium.featuredUntil'] = -1;
      sort.createdAt = -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      // Always sort premium first
      if (sortBy !== 'premium') {
        sort['premium.isPremium'] = -1;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [escorts, total] = await Promise.all([
      Escort.find(filter)
        .populate('user', 'firstName lastName')
        .select('-contact -user.email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Escort.countDocuments(filter)
    ]);

    res.json({
      escorts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalEscorts: total,
      hasNext: skip + parseInt(limit) < total,
      hasPrev: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Get escorts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single escort by ID
router.get('/:id', async (req, res) => {
  try {
    const escort = await Escort.findById(req.params.id)
      .populate('user', 'firstName lastName createdAt')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'firstName'
        }
      });

    if (!escort || !escort.isActive || !escort.isApproved) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Increment view count
    escort.stats.views += 1;
    await escort.save();

    res.json({ escort });
  } catch (error) {
    console.error('Get escort error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Escort not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new escort profile
router.post('/', escortAuth, [
  body('stageName').trim().isLength({ min: 2, max: 50 }),
  body('description').trim().isLength({ min: 50, max: 2000 }),
  body('age').isInt({ min: 18, max: 65 }),
  body('location.city').trim().isLength({ min: 2 }),
  body('physical.bodyType').optional().isIn(['Slim', 'Athletic', 'Average', 'Curvy', 'BBW', 'Other']),
  body('physical.ethnicity').optional().isIn(['White', 'Asian', 'Black', 'Mixed', 'Latin', 'Middle Eastern', 'Other']),
  body('services.incall.available').optional().isBoolean(),
  body('services.outcall.available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has an escort profile
    const existingEscort = await Escort.findOne({ user: req.user.userId });
    if (existingEscort) {
      return res.status(400).json({ message: 'User already has an escort profile' });
    }

    const escortData = {
      ...req.body,
      user: req.user.userId
    };

    const escort = new Escort(escortData);
    await escort.save();

    res.status(201).json({
      message: 'Escort profile created successfully',
      escort
    });
  } catch (error) {
    console.error('Create escort error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update escort profile
router.put('/:id', escortAuth, [
  body('stageName').optional().trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ min: 50, max: 2000 }),
  body('age').optional().isInt({ min: 18, max: 65 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const escort = await Escort.findById(req.params.id);
    
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Check ownership or admin
    if (escort.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(escort, req.body);
    await escort.save();

    res.json({
      message: 'Escort profile updated successfully',
      escort
    });
  } catch (error) {
    console.error('Update escort error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search escorts
router.get('/search/query', [
  query('q').trim().isLength({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchFilter = {
      $and: [
        { isActive: true },
        { isApproved: true },
        {
          $text: { $search: q }
        }
      ]
    };

    const [escorts, total] = await Promise.all([
      Escort.find(searchFilter)
        .populate('user', 'firstName lastName')
        .select('-contact')
        .sort({ score: { $meta: 'textScore' }, 'premium.isPremium': -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Escort.countDocuments(searchFilter)
    ]);

    res.json({
      escorts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalResults: total,
      query: q
    });
  } catch (error) {
    console.error('Search escorts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured escorts
router.get('/featured/list', async (req, res) => {
  try {
    const featuredEscorts = await Escort.find({
      isActive: true,
      isApproved: true,
      'premium.featuredUntil': { $gt: new Date() }
    })
    .populate('user', 'firstName lastName')
    .select('-contact')
    .sort({ 'premium.featuredUntil': -1 })
    .limit(8);

    res.json({ escorts: featuredEscorts });
  } catch (error) {
    console.error('Get featured escorts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to favorites
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const escort = await Escort.findById(req.params.id);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    const user = await User.findById(req.user.userId);
    const isFavorited = user.favorites.includes(req.params.id);

    if (isFavorited) {
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
      escort.stats.favorites -= 1;
    } else {
      user.favorites.push(req.params.id);
      escort.stats.favorites += 1;
    }

    await Promise.all([user.save(), escort.save()]);

    res.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited
    });
  } catch (error) {
    console.error('Favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;