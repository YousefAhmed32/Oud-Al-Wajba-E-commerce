const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token from cookies and attaches user info to request
 */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user!',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'CLIENT__SECRET__KEY');
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user!',
    });
  }
};

/**
 * Admin Authorization Middleware
 * Must be used after authMiddleware
 * Checks if user has admin role
 */
const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  req.isAdmin = true;
  next();
};

module.exports = {
  authMiddleware,
  isAdmin,
};

