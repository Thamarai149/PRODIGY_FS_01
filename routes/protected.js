const express = require('express');
const { authenticateToken, requireAdmin, requireUserOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected route - requires authentication
router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to your dashboard!',
    data: {
      user: req.user,
      timestamp: new Date().toISOString()
    }
  });
});

// User-only protected route
router.get('/user-data', authenticateToken, requireUserOrAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'This is user-specific data',
    data: {
      userId: req.user.id,
      username: req.user.username,
      role: req.user.role,
      accessLevel: 'user'
    }
  });
});

// Admin-only protected route
router.get('/admin-panel', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the admin panel!',
    data: {
      adminUser: req.user,
      accessLevel: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users']
    }
  });
});

// Admin route to get all users (example of admin functionality)
router.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // In a real application, you'd implement pagination and filtering
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: [
          // This would come from database in real implementation
          {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            created_at: req.user.created_at
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;