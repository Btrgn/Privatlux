const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Placeholder for upload routes
router.post('/', auth, (req, res) => {
  res.json({ message: 'Upload endpoint' });
});

module.exports = router;