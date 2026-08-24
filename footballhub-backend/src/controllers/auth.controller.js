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
      
      console.log(`[AUTH DIAGNOSTICS] Request started for sendEmailOtp. Email: ${email.replace(/(?<=^.{2}).*(?=@)/, '***')}`);
      const startTime = Date.now();
      
      // Wrap service call in a 25-second timeout to allow for slower external API responses
      // without keeping the client hanging indefinitely.
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email service timeout - Resend took too long')), 25000)
      );
      
      const response = await Promise.race([
        authService.sendEmailOtp(email),
        timeoutPromise
      ]);
      
      console.log(`[AUTH DIAGNOSTICS] Backend request completed successfully in ${Date.now() - startTime}ms`);
      
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
      console.error(`[AUTH DIAGNOSTICS] Backend error: ${error.message}`);
      return next(error);
    }
  }

  async verifyEmailOtp(req, res, next) {
    try {
      const { email, otp, isSignup, password } = req.body;
      console.log(`[AUTH CONTROLLER] Received verifyEmailOtp request for email: ${email}, otp: ${otp}, isSignup: ${isSignup}`);
      const { user, token, firebaseToken, isNewUser } = await authService.verifyEmailOtpAndLogin(email, otp, isSignup, password);
      console.log(`[AUTH CONTROLLER] Verification successful for email: ${email}`);
      return successResponse(res, { user, token, firebaseToken, isNewUser }, 'Email OTP verified successfully');
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Error verifying OTP for email: ${req.body.email}`, error);
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
         throw new Error("Password must be at least 6 characters.");
      }
      await authService.resetPasswordWithOtp(email, otp, newPassword);
      return successResponse(res, { success: true }, 'Password updated successfully');
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Error resetting password: ${req.body.email}`, error);
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const { uid } = req.user; // Attached by auth middleware
      
      let user = await userService.findById(uid);
      
      if (!user && req.user.email) {
        // MIGRATION: Check if they exist by email under a legacy ID
        const legacyUser = await userService.findByEmail(req.user.email);
        if (legacyUser) {
           console.log(`[AUTH CONTROLLER] Migrating legacy user ${legacyUser.id} to canonical UID ${uid}`);
           user = await userService.updateUser(uid, { ...legacyUser, id: uid, migratedAt: new Date() });
        }
      }

      if (!user) {
         return res.json({ success: true, data: { id: uid, email: req.user.email }});
      }
      
      const backendToken = require('../services/auth.service').generateToken(user);
      
      return successResponse(res, { ...user, backendToken }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const { uid } = req.user;
      
      if (!req.body || Object.keys(req.body).length === 0) {
        const err = new Error('Invalid profile data');
        err.statusCode = 400;
        throw err;
      }

      const updatedUser = await userService.updateUser(uid, req.body);
      return successResponse(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Error updating profile for uid: ${req.user?.uid}`, error);
      next(error);
    }
  }
}

module.exports = new AuthController();
