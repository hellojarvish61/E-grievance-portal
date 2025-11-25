const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password, role, studentId, department, designation } = req.body;

    // Validation: Check if all required fields are provided
    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Role-specific validation
    if (role === 'student' && !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required for students',
      });
    }

    if (role === 'teacher' && !designation) {
      return res.status(400).json({
        success: false,
        message: 'Designation is required for teachers',
      });
    }

    // Hash password (encrypt it)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      department,
    };

    // Add role-specific fields
    if (role === 'student') {
      userData.studentId = studentId;
      userData.isApproved = true; // Students are auto-approved
    }
    
    if (role === 'teacher') {
      userData.designation = designation;
      userData.isApproved = false; // Teachers need approval
    }
    
    if (role === 'admin') {
      // Check if this is the first admin
      const adminCount = await User.countDocuments({ role: 'admin' });
      
      if (adminCount === 0) {
        // First admin - auto approve
        userData.isApproved = true;
        console.log('🎉 First admin registered - auto approved');
      } else {
        // Additional admins need approval
        userData.isApproved = false;
      }
    }

    // Save user to database
    const user = await User.create(userData);

    // Generate JWT token only for approved users
    let token = null;
    if (user.isApproved) {
      token = generateToken(user._id);
    }

    // Send response
    res.status(201).json({
      success: true,
      message: user.isApproved 
        ? 'User registered successfully' 
        : `Registration successful! Your ${user.role} account is pending admin approval.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isApproved: user.isApproved,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email (include password this time)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // NEW: Check if account is approved (for teachers and admins)
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval from admin. Please wait for approval before logging in.',
        accountStatus: 'pending',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isApproved: user.isApproved,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private (requires token)
exports.getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};