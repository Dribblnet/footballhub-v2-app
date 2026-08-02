const msg91Service = require('./msg91.service');
const emailService = require('./email.service');
const userService = require('./user.service');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

class AuthService {
  async sendOtp(phoneNumber) {
    // Basic phone number validation - e.g., must contain country code +91
    // In production, use a library like libphonenumber-js for robust validation
    if (!phoneNumber || phoneNumber.length < 10) {
      const err = new Error('Invalid phone number format');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    return await msg91Service.sendOtp(phoneNumber);
  }

  async verifyOtpAndLogin(phoneNumber, otp) {
    if (!phoneNumber || !otp) {
      const err = new Error('Phone number and OTP are required');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    // Verify OTP via MSG91
    await msg91Service.verifyOtp(phoneNumber, otp);

    // Check if user exists in Firestore
    let user = await userService.findByPhoneNumber(phoneNumber);
    let isNewUser = false;

    // If first login, create new user
    if (!user) {
      user = await userService.createUser(phoneNumber);
      isNewUser = true;
    }

    // Generate JWT
    const token = this.generateToken(user);

    return {
      user,
      token,
      isNewUser,
    };
  }

  async sendEmailOtp(email) {
    if (!email) {
      const err = new Error('Email is required');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    const otp = emailService.generateOtp();
    console.log("OTP GENERATED");
    emailService.storeOtp(email, otp);

    await emailService.sendOtpEmail(email, otp);
    console.log("EMAIL SENT");

    return { success: true, message: 'Email OTP sent successfully' };
  }

  async verifyEmailOtpAndLogin(email, otp) {
    if (!email || !otp) {
      const err = new Error('Email and OTP are required');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    const verificationResult = emailService.verifyOtp(email, otp);
    if (!verificationResult.success) {
      const err = new Error(verificationResult.message || 'Invalid or expired OTP');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    console.log(`[AUTH SERVICE DEBUG] Firestore lookup for email: ${email}`);
    let user = await userService.findByEmail(email);
    let isNewUser = false;

    if (!user) {
      console.log(`[AUTH SERVICE DEBUG] Creating new user for email: ${email}`);
      user = await userService.createUserByEmail(email);
      isNewUser = true;
    } else {
      console.log(`[AUTH SERVICE DEBUG] Existing user found: ${user.uid}`);
    }

    console.log(`[AUTH SERVICE DEBUG] JWT creation for uid: ${user.uid}`);
    const token = this.generateToken(user);

    return {
      user,
      token,
      isNewUser,
    };
  }

  generateToken(user) {
    return jwt.sign(
      {
        uid: user.uid,
        phoneNumber: user.phoneNumber || null,
        email: user.email || null,
        role: user.role,
      },
      env.jwtSecret,
      { expiresIn: '30d' }
    );
  }
}

module.exports = new AuthService();
