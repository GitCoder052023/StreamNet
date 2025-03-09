const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!email || !email.endsWith('@gmail.com')) {
    return res.status(400).json({ success: false, message: 'Email must be a valid Gmail address.' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ success: false, message: 'Password does not meet the requirements.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    res.json({ success: true, token: 'dummy-token', username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

router.delete('/logout', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }
  try {
    await User.deleteOne({ username });
    res.json({ success: true, message: 'User successfully logged out and deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Logout failed.' });
  }
});

router.post('/theme', async (req, res) => {
  const { username, theme } = req.body;
  try {
      await User.findOneAndUpdate({ username }, { theme });
      res.json({ success: true, message: 'Theme updated successfully' });
  } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update theme' });
  }
});

module.exports = router;