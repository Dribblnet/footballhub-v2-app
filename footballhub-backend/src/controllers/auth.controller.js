const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const { successResponse } = require('../utils/response.util');

class AuthController {
  async sendOtp(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      
      const response = await authService.sendOtp(phoneNumber);
      
      return successResponse(res, response, 'OTP sent successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { phoneNumber, otp } = req.body;
      
      const { user, token, isNewUser } = await authService.verifyOtpAndLogin(phoneNumber, otp);
      
      return successResponse(res, { user, token, isNewUser }, 'OTP verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async sendEmailOtp(req, res, next) {
    try {
      console.log("REQUEST ARRIVAL");
      const { email } = req.body;
      
      // Wrap service call in a 10-second timeout to prevent hanging connections
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email service timeout')), 10000)
      );
      
      const response = await Promise.race([
        authService.sendEmailOtp(email),
        timeoutPromise
      ]);
      
      if (res.headersSent) return;
      const responseObj = {
        success: true,
        message: 'Email OTP sent successfully',
        data: response
      };
      res.status(200).json(responseObj);
      console.log("RESPONSE SENT");
      console.log("REQUEST FINISHED");
      return;
    } catch (error) {
      if (res.headersSent) return;
      return next(error);
    }
  }

  async verifyEmailOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      console.log(`[AUTH CONTROLLER] Received verifyEmailOtp request for email: ${email}, otp: ${otp}`);
      const { user, token, isNewUser } = await authService.verifyEmailOtpAndLogin(email, otp);
      console.log(`[AUTH CONTROLLER] Verification successful for email: ${email}`);
      return successResponse(res, { user, token, isNewUser }, 'Email OTP verified successfully');
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Error verifying OTP for email: ${req.body.email}`, error);
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const { uid } = req.user; // Attached by auth middleware
      
      const user = await userService.findById(uid);
      
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        err.errorCode = 'USER_NOT_FOUND';
        throw err;
      }
      
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
