const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');

// Import validators
const { validateRequest } = require('../validators/userValidator');
const { 
  registerSchema, 
  loginSchema 
} = require('../validators/userValidator');

// Import middleware
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  validateRequest(registerSchema),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', 
  validateRequest(loginSchema),
  authController.login
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', 
  authMiddleware.authenticate,
  authController.logout
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', 
  authMiddleware.authenticate,
  authController.getProfile
);

module.exports = router;
