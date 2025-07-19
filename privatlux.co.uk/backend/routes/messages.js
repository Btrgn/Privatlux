const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Placeholder for message routes
router.get('/', auth, (req, res) => {
  res.json({ messages: [] });
});

module.exports = router;