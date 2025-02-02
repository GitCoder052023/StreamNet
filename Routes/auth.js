const express = require('express');
const path = require('path');
const router = express.Router();
const { authenticate } = require('../Server/utils/authMiddleware');

router.get('/login', (req, res) => {
    res.render('Auth/login.html', {
        process: {
            env: {
                HOST: process.env.HOST
            }
        }
    });
});

router.get('/signup', (req, res) => {
    res.render('Auth/signup.html', {
        process: {
            env: {
                HOST: process.env.HOST
            }
        }
    });
});

router.post('/logout', authenticate, (req, res) => {
    authController.logout(req, res);
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