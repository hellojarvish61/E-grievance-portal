// const express = require('express');
// const router = express.Router();
// const { register, login, getMe } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// // Public routes (no login required)
// router.post('/register', register);
// router.post('/login', login);

// // Protected route (login required)
// router.get('/me', protect, getMe);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
