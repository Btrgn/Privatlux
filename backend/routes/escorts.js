const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Escort = require('../models/Escort');
const User = require('../models/User');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get all escorts with pagination and filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('city').optional().trim(),
  query('minAge').optional().isInt({ min: 18 }),
  query('maxAge').optional().isInt({ max: 65 }),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('hairColor').optional().isIn(['blonde', 'brunette', 'black', 'red', 'grey', 'other']),
  query('ethnicity').optional().isIn(['caucasian', 'asian', 'african', 'latina', 'mixed', 'other']),
  query('services').optional(),
  query('availability').optional().isIn(['incall', 'outcall']),
  query('sortBy').optional().isIn(['newest', 'popular', 'rating', 'price_low', 'price_high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'active' };

    if (req.query.city) {
      filter['location.city'] = new RegExp(req.query.city, 'i');
    }

    if (req.query.minAge || req.query.maxAge) {
      filter.age = {};
      if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge);
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter['pricing.hourly'] = {};
      if (req.query.minPrice) filter['pricing.hourly'].$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter['pricing.hourly'].$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.hairColor) {
      filter.hairColor = req.query.hairColor;
    }

    if (req.query.ethnicity) {
      filter.ethnicity = req.query.ethnicity;
    }

    if (req.query.services) {
      const services = req.query.services.split(',');
      filter['services.name'] = { $in: services };
    }

    if (req.query.availability) {
      filter[`availability.${req.query.availability}`] = true;
    }

    // Build sort object
    let sort = {};
    switch (req.query.sortBy) {
      case 'popular':
        sort = { 'statistics.views': -1 };
        break;
      case 'rating':
        sort = { 'reviews.average': -1 };
        break;
      case 'price_low':
        sort = { 'pricing.hourly': 1 };
        break;
      case 'price_high':
        sort = { 'pricing.hourly': -1 };
        break;
      default:
        sort = { featured: -1, createdAt: -1 };
    }

    const escorts = await Escort.find(filter)
      .populate('user', 'firstName lastName lastActive')
      .select('-user.password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Escort.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      escorts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
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
      .populate('user', 'firstName lastName lastActive')
      .select('-user.password');

    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    if (escort.status !== 'active') {
      return res.status(404).json({ message: 'Escort profile not available' });
    }

    // Increment view count
    await escort.incrementViews();

    res.json({ escort });
  } catch (error) {
    console.error('Get escort error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new escort profile
router.post('/', authenticateToken, [
  body('stageName').trim().isLength({ min: 1, max: 50 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('age').isInt({ min: 18, max: 65 }),
  body('location.city').trim().isLength({ min: 1 }),
  body('pricing.hourly').optional().isNumeric()
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

    // Update user role to escort
    await User.findByIdAndUpdate(req.user.userId, { role: 'escort' });

    const escortData = {
      user: req.user.userId,
      ...req.body
    };

    const escort = new Escort(escortData);
    await escort.save();

    const populatedEscort = await Escort.findById(escort._id)
      .populate('user', 'firstName lastName email');

    res.status(201).json({
      message: 'Escort profile created successfully',
      escort: populatedEscort
    });
  } catch (error) {
    console.error('Create escort error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update escort profile
router.put('/:id', authenticateToken, [
  body('stageName').optional().trim().isLength({ min: 1, max: 50 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }),
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

    // Check ownership or admin access
    if (escort.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedEscort = await Escort.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'firstName lastName email');

    res.json({
      message: 'Escort profile updated successfully',
      escort: updatedEscort
    });
  } catch (error) {
    console.error('Update escort error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete escort profile
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const escort = await Escort.findById(req.params.id);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Check ownership or admin access
    if (escort.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this profile' });
    }

    await Escort.findByIdAndDelete(req.params.id);

    // Update user role back to client if not admin
    if (req.user.role !== 'admin') {
      await User.findByIdAndUpdate(req.user.userId, { role: 'client' });
    }

    res.json({ message: 'Escort profile deleted successfully' });
  } catch (error) {
    console.error('Delete escort error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to favorites
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const escort = await Escort.findById(req.params.id);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    const user = await User.findById(req.user.userId);
    
    if (user.favorites.includes(req.params.id)) {
      return res.status(400).json({ message: 'Escort already in favorites' });
    }

    user.favorites.push(req.params.id);
    await user.save();

    // Update escort favorites count
    escort.statistics.favorites += 1;
    await escort.save();

    res.json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from favorites
router.delete('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const index = user.favorites.indexOf(req.params.id);
    if (index === -1) {
      return res.status(400).json({ message: 'Escort not in favorites' });
    }

    user.favorites.splice(index, 1);
    await user.save();

    // Update escort favorites count
    const escort = await Escort.findById(req.params.id);
    if (escort) {
      escort.statistics.favorites = Math.max(0, escort.statistics.favorites - 1);
      await escort.save();
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured escorts
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const escorts = await Escort.find({ 
      status: 'active', 
      featured: true 
    })
      .populate('user', 'firstName lastName lastActive')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ escorts });
  } catch (error) {
    console.error('Get featured escorts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;