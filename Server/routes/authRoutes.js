const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin, handleValidationErrors } = require('../utils/validation');
const { authenticate } = require('../utils/authMiddleware');
const { sendEmail } = require('../utils/emailService');

module.exports = (authController, otpModel) => {
  router.post('/send-signup-otp', async (req, res) => {
    const { email } = req.body;

    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Only Gmail addresses are allowed' });
    }

    try {
      const otp = Math.floor(1000 + Math.random() * 9000);

      // Delete any existing OTPs for this email and purpose
      await otpModel.deleteOTP(email, 'signup');

      // Store new OTP
      await otpModel.createOTP({
        email,
        otp,
        purpose: 'signup',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min expiry
      });

      // Send email
      const emailSent = await sendEmail(
        email,
        'QChat Registration OTP',
        `Your OTP for registration is: ${otp}`
      );

      if (!emailSent) {
        throw new Error('Failed to send email');
      }

      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error('OTP error:', err);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  });

  router.post('/verify-otp', async (req, res) => {
    const { email, otp, purpose } = req.body;

    try {
      const validOTP = await otpModel.verifyOTP(email, parseInt(otp), purpose);

      if (!validOTP) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Delete used OTP
      await otpModel.deleteOTP(email, purpose);

      res.json({ message: 'OTP verified successfully' });
    } catch (err) {
      console.error('OTP verification error:', err);
      res.status(500).json({ message: 'Failed to verify OTP' });
    }
  });

  router.post(
    '/signup',
    validateSignup,
    handleValidationErrors,
    authController.signup.bind(authController)
  );

  router.post(
    '/login',
    validateLogin,
    handleValidationErrors,
    authController.login.bind(authController)
  );

  router.post(
    '/logout',
    authenticate,
    authController.logout.bind(authController)
  );

  return router;
};
