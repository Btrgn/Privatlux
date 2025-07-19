const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Placeholder for payment routes
router.get('/', auth, (req, res) => {
  res.json({ payments: [] });
});

module.exports = router;