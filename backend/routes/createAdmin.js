//http://localhost:5000/api/setup/create-default-admin

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 👉 Hit this route only once to create admin
router.get('/create-default-admin', async (req, res) => {
  try {
    const email = "admin@gmail.com";
    const password = "Admin@123";
    const name = "System Admin";

    // Check if admin exists
    const exist = await User.findOne({ email });
    if (exist) return res.send("✅ Admin already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      department: "Computer Science",   // required field in schema
      isApproved: true                  // auto approve admin
    });

    res.send("✅ Admin created successfully\nEmail: admin@gmail.com\nPassword: Admin@123");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
