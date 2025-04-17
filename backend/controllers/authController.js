const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Registration attempt for:', email);

    // Enhanced input validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required',
        errors: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase().trim() }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: existingUser.email.toLowerCase() === email.toLowerCase().trim() 
          ? 'Email already registered' 
          : 'Username is taken' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    console.log('User registered successfully:', {
      id: user._id,
      email: user.email
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email (case-insensitive and trimmed)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    console.log('User found:', user.email);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    console.log('Login successful:', {
      id: user._id,
      email: user.email
    });

    res.json({ 
      success: true, 
      token,
      user: { 
        _id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('reviews', 'rating comment book');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        reviews: user.reviews,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error getting user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const token = generateToken(req.user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Clear user's session if using sessions
    // For JWT, the client will remove the token
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

 
  

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  refreshToken
};