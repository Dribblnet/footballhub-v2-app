const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { errorResponse } = require('../utils/response.util');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    return errorResponse(res, 'Too many requests, please try again later.', 'RATE_LIMIT_EXCEEDED', options.statusCode);
  },
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each email/IP to 3 OTP requests per 5 minutes
  keyGenerator: (req, res) => {
    if (req.body.email) return req.body.email.toLowerCase().trim();
    if (req.body.phoneNumber) return req.body.phoneNumber.trim();
    return ipKeyGenerator(req, res);
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000);
    return res.status(options.statusCode).json({
      success: false,
      message: 'Limit reached for this account. Please wait before requesting another OTP.',
      errorCode: 'OTP_LIMIT_EXCEEDED',
      retryAfter: retryAfter > 0 ? retryAfter : 300
    });
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each email/IP to 5 incorrect OTP attempts per 5 minutes
  keyGenerator: (req, res) => {
    if (req.body.email) return req.body.email.toLowerCase().trim();
    if (req.body.phoneNumber) return req.body.phoneNumber.trim();
    return ipKeyGenerator(req, res);
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed verifications
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000);
    return res.status(options.statusCode).json({
      success: false,
      message: 'Too many incorrect attempts. Please wait before trying again.',
      errorCode: 'OTP_VERIFY_LIMIT_EXCEEDED',
      retryAfter: retryAfter > 0 ? retryAfter : 300
    });
  },
});

module.exports = {
  apiLimiter,
  otpLimiter,
  otpVerifyLimiter,
};
