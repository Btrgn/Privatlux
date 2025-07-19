const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Placeholder for review routes
router.get('/', (req, res) => {
  res.json({ reviews: [] });
});

module.exports = router;