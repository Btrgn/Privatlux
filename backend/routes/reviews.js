const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Review = require('../models/Review');
const Escort = require('../models/Escort');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get reviews for an escort
router.get('/escort/:escortId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sortBy').optional().isIn(['createdAt', 'rating', 'helpful'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      escort: req.params.escortId,
      isApproved: true,
      isHidden: false
    };

    const sort = {};
    sort[sortBy] = sortBy === 'rating' ? -1 : -1; // Newest/highest first

    const [reviews, total, avgRating] = await Promise.all([
      Review.find(filter)
        .populate('reviewer', 'firstName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: filter },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      reviews,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalReviews: total,
      averageRating: avgRating[0]?.avgRating || 0,
      reviewCount: avgRating[0]?.count || 0
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new review
router.post('/', auth, [
  body('escort').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('content').trim().isLength({ min: 10, max: 1000 }),
  body('serviceType').isIn(['Incall', 'Outcall']),
  body('duration').optional().isIn(['30min', '1hour', '2hours', 'Overnight', 'Other']),
  body('categories.appearance').optional().isInt({ min: 1, max: 5 }),
  body('categories.service').optional().isInt({ min: 1, max: 5 }),
  body('categories.communication').optional().isInt({ min: 1, max: 5 }),
  body('categories.location').optional().isInt({ min: 1, max: 5 }),
  body('categories.value').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { escort: escortId } = req.body;

    // Check if escort exists
    const escort = await Escort.findById(escortId);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Check if user already reviewed this escort
    const existingReview = await Review.findOne({
      escort: escortId,
      reviewer: req.user.userId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this escort' });
    }

    // Prevent escorts from reviewing themselves
    if (escort.user.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot review your own profile' });
    }

    const review = new Review({
      ...req.body,
      reviewer: req.user.userId
    });

    await review.save();

    // Update escort's rating and review count
    const reviews = await Review.find({ 
      escort: escortId, 
      isApproved: true 
    });
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Escort.findByIdAndUpdate(escortId, {
      'stats.rating': avgRating,
      'stats.reviewCount': reviews.length
    });

    await review.populate('reviewer', 'firstName');

    res.status(201).json({
      message: 'Review submitted successfully. It will be reviewed before publication.',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked as helpful
    const alreadyHelpful = review.helpfulBy.includes(req.user.userId);
    
    if (alreadyHelpful) {
      // Remove helpful vote
      review.helpfulBy = review.helpfulBy.filter(id => id.toString() !== req.user.userId);
      review.helpful -= 1;
    } else {
      // Add helpful vote
      review.helpfulBy.push(req.user.userId);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      message: alreadyHelpful ? 'Helpful vote removed' : 'Marked as helpful',
      helpful: review.helpful,
      isHelpful: !alreadyHelpful
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/my-reviews', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ reviewer: req.user.userId })
        .populate('escort', 'stageName images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ reviewer: req.user.userId })
    ]);

    res.json({
      reviews,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review (only before approval)
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('content').optional().trim().isLength({ min: 10, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.reviewer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only edit if not yet approved
    if (review.isApproved) {
      return res.status(400).json({ message: 'Cannot edit approved review' });
    }

    Object.assign(review, req.body);
    await review.save();

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership or admin
    if (review.reviewer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update escort's stats
    const reviews = await Review.find({ 
      escort: review.escort, 
      isApproved: true 
    });
    
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Escort.findByIdAndUpdate(review.escort, {
      'stats.rating': avgRating,
      'stats.reviewCount': reviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;