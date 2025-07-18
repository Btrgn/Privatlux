const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Token verification failed' });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

// Check if user has active membership
const requireMembership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!req.user.hasActiveMembership()) {
    return res.status(403).json({ 
      message: 'Active membership required',
      membershipRequired: true 
    });
  }

  next();
};

// Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        requiredRole: roles 
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = requireRole(['admin']);

// Check if user is escort
const requireEscort = requireRole(['escort', 'admin']);

// Check if user owns the resource or is admin
const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Admins can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if the resource belongs to the user
    const resourceUserId = req.params.userId || req.body[resourceField] || req.query[resourceField];
    
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied - not resource owner' });
    }

    next();
  };
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip + ':' + (req.user ? req.user._id : 'anonymous');
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
    
    if (recentAttempts.length >= max) {
      return res.status(429).json({ 
        message: 'Too many attempts, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    recentAttempts.push(now);
    attempts.set(key, recentAttempts);
    
    next();
  };
};

// GDPR compliance check
const requireGDPRConsent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!req.user.gdprConsent) {
    return res.status(403).json({ 
      message: 'GDPR consent required',
      gdprConsentRequired: true 
    });
  }

  next();
};

// Terms acceptance check
const requireTermsAcceptance = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!req.user.termsAccepted) {
    return res.status(403).json({ 
      message: 'Terms and conditions acceptance required',
      termsAcceptanceRequired: true 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireMembership,
  requireRole,
  requireAdmin,
  requireEscort,
  requireOwnership,
  sensitiveOperationLimit,
  requireGDPRConsent,
  requireTermsAcceptance
};