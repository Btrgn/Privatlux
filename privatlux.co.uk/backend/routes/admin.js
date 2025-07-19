const express = require('express');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Placeholder for admin routes
router.get('/dashboard', adminAuth, (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;