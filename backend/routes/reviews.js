const express = require('express');
const Review = require('../models/Review');
const Escort = require('../models/Escort');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get reviews for an escort
router.get('/escort/:escortId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      escort: req.params.escortId,
      status: 'approved'
    })
      .populate('reviewer', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { escortId, rating, title, content } = req.body;

    const review = new Review({
      escort: escortId,
      reviewer: req.user.userId,
      rating,
      title,
      content
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;