const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes (no login required)
router.post('/register', register);
router.post('/login', login);

// Protected route (login required)
router.get('/me', protect, getMe);

module.exports = router;