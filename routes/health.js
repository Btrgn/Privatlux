const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get basic system info
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: dbStatus,
        name: mongoose.connection.name
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    };

    res.status(200).json(healthInfo);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;