const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin, handleValidationErrors } = require('../utils/validation');
const { authenticate } = require('../utils/authMiddleware');
const { sendEmail } = require('../utils/emailService');

module.exports = (authController, otpModel) => {

  router.post('/send-signup-otp', async (req, res) => {
    const { email, fullName } = req.body;

    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Only Gmail addresses are allowed' });
    }

    try {
      const otp = Math.floor(1000 + Math.random() * 9000);

      await otpModel.deleteOTP(email, 'signup');
      await otpModel.createOTP({
        email,
        otp,
        purpose: 'signup',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      const emailText = `
Dear ${fullName},

Welcome to QChat!

To complete your registration, please use the following verification code:

${otp}

This code will expire in 10 minutes for security purposes.

If you did not attempt to create a QChat account, please ignore this email.

Best regards,
The QChat Team

Note: This is an automated message, please do not reply to this email.
`;

      const emailSent = await sendEmail(
        email,
        'Welcome to QChat - Verify Your Email',
        emailText
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

  router.get(
    '/user-info',
    authenticate,
    authController.getUserInfo.bind(authController)
  );

  return router;
};
