const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { otpLimiter, otpVerifyLimiter } = require('../middleware/rateLimit.middleware');

// Public routes (with specific rate limiters)
router.post('/send-otp', otpLimiter, authController.sendOtp);
router.post('/verify-otp', otpVerifyLimiter, authController.verifyOtp);

router.post('/send-email-otp', otpLimiter, authController.sendEmailOtp);
router.post('/verify-email-otp', otpVerifyLimiter, authController.verifyEmailOtp);
router.post('/reset-password', otpVerifyLimiter, authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
