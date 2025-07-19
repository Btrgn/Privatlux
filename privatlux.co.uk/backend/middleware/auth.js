const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token is no longer valid' });
    }

    req.user = decoded;
    req.userDoc = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin only middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Escort or admin middleware
const escortAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'escort' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Escort access required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Escort auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
module.exports.auth = auth;
module.exports.adminAuth = adminAuth;
module.exports.escortAuth = escortAuth;