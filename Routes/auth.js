const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/Auth/login.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/Auth/signup.html'));
});

router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/Auth/ResetPassword/Submit_Email.html')); 
});

router.get('/verify-otp', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/Auth/ResetPassword/Verify_OTP.html'));
});

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/Auth/ResetPassword/Reset_Password.html'));
});

module.exports = router;