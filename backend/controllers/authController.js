const User = require('../models/User');
const database = require('../config/database');
const logger = require('../config/logger');
const { AppError } = require('../utils/errors');

// Register a new user
const register = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('User with this email already exists', 409));
    }

    // Create new user
    const userData = {
      email: email.toLowerCase().trim(),
      password,
      first_name: first_name.trim(),
      last_name: last_name.trim()
    };

    const user = await User.create(userData);

    logger.info(`New user registered: ${user.email}`, { userId: user.id });

    // Return user data without sensitive information
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    
    // Handle duplicate email error from database
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError('User with this email already exists', 409));
    }
    
    next(new AppError('Registration failed. Please try again.', 500));
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if user is active
    if (!user.isActive()) {
      return next(new AppError('Account is deactivated. Please contact support.', 401));
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in database
    await storeRefreshToken(user.id, refreshToken);

    logger.info(`User logged in: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: process.env.JWT_EXPIRE || '15m'
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    next(new AppError('Login failed. Please try again.', 500));
  }
};

// Refresh access token
const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return next(new AppError('Refresh token is required', 400));
    }

    // Verify refresh token
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Check if refresh token exists in database
    const tokenExists = await checkRefreshToken(decoded.id, refresh_token);
    if (!tokenExists) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive()) {
      return next(new AppError('User not found or inactive', 401));
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    logger.info(`Token refreshed for user: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: process.env.JWT_EXPIRE || '15m'
      }
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    next(new AppError('Token refresh failed. Please login again.', 500));
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const userId = req.user?.id;

    if (refresh_token) {
      // Remove refresh token from database
      await removeRefreshToken(userId, refresh_token);
    }

    logger.info(`User logged out`, { userId });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    next(new AppError('Logout failed', 500));
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    next(new AppError('Failed to get user profile', 500));
  }
};

// Helper function to store refresh token
const storeRefreshToken = async (userId, token) => {
  try {
    const bcrypt = require('bcryptjs');
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const query = `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `;

    await database.query(query, [userId, tokenHash, expiresAt]);
  } catch (error) {
    logger.error('Error storing refresh token:', error);
    throw error;
  }
};

// Helper function to check refresh token
const checkRefreshToken = async (userId, token) => {
  try {
    const query = `
      SELECT token_hash FROM refresh_tokens 
      WHERE user_id = ? AND expires_at > NOW()
    `;

    const rows = await database.query(query, [userId]);
    
    const bcrypt = require('bcryptjs');
    for (const row of rows) {
      const isValid = await bcrypt.compare(token, row.token_hash);
      if (isValid) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    logger.error('Error checking refresh token:', error);
    throw error;
  }
};

// Helper function to remove refresh token
const removeRefreshToken = async (userId, token) => {
  try {
    if (!userId || !token) return;

    const query = `
      SELECT id, token_hash FROM refresh_tokens 
      WHERE user_id = ? AND expires_at > NOW()
    `;

    const rows = await database.query(query, [userId]);
    
    const bcrypt = require('bcryptjs');
    for (const row of rows) {
      const isValid = await bcrypt.compare(token, row.token_hash);
      if (isValid) {
        await database.query('DELETE FROM refresh_tokens WHERE id = ?', [row.id]);
        break;
      }
    }
  } catch (error) {
    logger.error('Error removing refresh token:', error);
    // Don't throw error for logout
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile
};
