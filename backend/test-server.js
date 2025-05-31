require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: { status: 'skipped for testing' }
    }
  });
});

// API root endpoint
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Sprint Management API v1.0 - Test Mode',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth',
      projects: '/api/v1/projects',
      boards: '/api/v1/boards',
      issues: '/api/v1/issues',
      sprints: '/api/v1/sprints',
      health: '/health'
    }
  });
});

// Test auth endpoints
app.post('/api/v1/auth/register', (req, res) => {
  console.log('Registration attempt:', req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email for verification.',
    data: {
      user: {
        id: 1,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_verified: false,
        created_at: new Date().toISOString()
      }
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  
  // Simple test credentials
  if (req.body.email === 'test@example.com' && req.body.password === 'password123') {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 1,
          email: req.body.email,
          first_name: 'Test',
          last_name: 'User',
          email_verified: true,
          created_at: new Date().toISOString()
        },
        tokens: {
          access_token: 'test-access-token-123',
          refresh_token: 'test-refresh-token-456',
          token_type: 'Bearer',
          expires_in: '15m'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    });
  }
});

app.get('/api/v1/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No valid token provided'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        email_verified: true,
        created_at: new Date().toISOString()
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.originalUrl} not found`
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api/v1`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\n📝 Test credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: password123`);
});

module.exports = app;
