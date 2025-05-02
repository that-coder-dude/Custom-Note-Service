const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Ensurin import of the User model

const router = express.Router();

// Registering route with password hashing
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validating input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Checking if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route with password comparison
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password); // Compare password with hashed one
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Creating JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
