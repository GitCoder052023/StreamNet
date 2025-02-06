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
    res.render('Utility/Verify_OTP.html', {
        process: {
            env: {
                HOST: process.env.HOST
            }
        }
    });
});

router.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../Public/templates/Auth/ResetPassword/Reset_Password.html'));
});

router.post('/send-signup-otp', async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000);

    try {
        await otpModel.create({
            email,
            otp,
            purpose: 'signup',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        await sendEmail(email, 'QChat Registration OTP',
            `Your OTP for registration is: ${otp}`);

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

module.exports = router;
