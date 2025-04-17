// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  logout, 
  refreshToken 
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);
router.post('/refresh', auth, refreshToken);  // Changed from /refreshToken to /refresh

module.exports = router;