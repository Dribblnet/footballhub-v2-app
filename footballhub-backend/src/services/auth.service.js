
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

    // MSG91 removed. Phone OTP relies on Firebase in the frontend.
    // Returning mock success to preserve API signature.
    return { type: 'success', message: 'OTP sent (mock)' };
  }

  async verifyOtpAndLogin(phoneNumber, otp) {
    if (!phoneNumber || !otp) {
      const err = new Error('Phone number and OTP are required');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    // Verify OTP via MSG91
    // MSG91 removed. Phone OTP relies on Firebase in the frontend.
    if (otp !== '123456') { // Mock verification to prevent arbitrary login
      const err = new Error('Phone OTP login is deprecated on backend');
      err.statusCode = 400;
      throw err;
    }

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

  async verifyEmailOtpAndLogin(email, otp, isSignup = false, password = null) {
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
    let token = null;
    let firebaseToken = null;
    const { auth } = require('../config/firebase');

    if (!user) {
      if (isSignup) {
        console.log(`[AUTH SERVICE DEBUG] Creating new user in backend for email: ${email}`);
        
        let firebaseUser;
        try {
          if (!password) throw new Error("Password is required for signup");
          firebaseUser = await auth.createUser({ email, password });
        } catch (err) {
          if (err.code === 'auth/email-already-exists') {
            firebaseUser = await auth.getUserByEmail(email);
          } else {
            console.error(`[AUTH SERVICE ERROR] Failed to create Firebase user:`, err);
            const createErr = new Error(err.message || 'Failed to create user account');
            createErr.statusCode = 400;
            throw createErr;
          }
        }
        
        user = await userService.createUserByEmailWithUid(email, firebaseUser.uid);
        isNewUser = true;
      } else {
        // Attempt to sync from Firebase Auth if they exist there but not in Firestore
        try {
          const firebaseUser = await auth.getUserByEmail(email);
          console.log(`[AUTH SERVICE DEBUG] User found in Firebase Auth but missing in Firestore. Syncing profile for: ${email}`);
          user = await userService.createUserByEmailWithUid(email, firebaseUser.uid);
        } catch (authErr) {
          // User does not exist in Firebase Auth either.
          console.error(`[AUTH SERVICE DEBUG] User not found in Firebase Auth: ${email}`);
          const err = new Error('No account found. Please sign up first.');
          err.statusCode = 404;
          throw err;
        }
      }
    } else {
      console.log(`[AUTH SERVICE DEBUG] Existing user found in Firestore: ${user.uid}`);
    }

    console.log(`[AUTH SERVICE DEBUG] JWT & Custom Token creation for uid: ${user.uid}`);
    token = this.generateToken(user);
    try {
      firebaseToken = await auth.createCustomToken(user.uid);
    } catch (tokenErr) {
      console.error(`[AUTH SERVICE ERROR] Failed to create Firebase Custom Token:`, tokenErr);
      const err = new Error('Failed to generate secure login session.');
      err.statusCode = 500;
      throw err;
    }

    emailService.deleteOtp(email);

    return {
      user,
      token,
      firebaseToken,
      isNewUser,
    };
  }

  async verifyResetOtp(email, otp) {
    if (!email || !otp) {
      const err = new Error('Email and OTP are required');
      err.statusCode = 400;
      throw err;
    }

    const verificationResult = emailService.verifyOtp(email, otp);
    if (!verificationResult.success) {
      const err = new Error(verificationResult.message || 'Invalid or expired OTP');
      err.statusCode = 400;
      throw err;
    }

    // OTP is valid. Generate a reset token and delete the OTP.
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    emailService.storeResetToken(email, resetToken);
    emailService.deleteOtp(email);

    return { resetToken };
  }

  async resetPasswordWithToken(email, resetToken, newPassword) {
    if (!email || !resetToken || !newPassword) {
      const err = new Error('Email, reset token, and new password are required');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    if (!emailService.verifyResetToken(email, resetToken)) {
      const err = new Error('Invalid or expired password reset session. Please request a new OTP.');
      err.statusCode = 400;
      err.name = 'ValidationError';
      throw err;
    }

    // Now securely update Firebase Auth password
    const { auth } = require('../config/firebase');
    try {
      let userRecord;
      try {
        // CASE 1: Firebase user exists by email
        userRecord = await auth.getUserByEmail(email);
        await auth.updateUser(userRecord.uid, { password: newPassword });
        console.log(`[AUTH SERVICE] Password reset successful for: ${email}`);
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          // CASE 2/3: User not found by email, check existing Firestore UID
          const firestoreUser = await userService.findByEmail(email);
          if (firestoreUser) {
            try {
              // CASE 2: Firebase user ALREADY EXISTS with this UID (but maybe different/missing email)
              userRecord = await auth.getUser(firestoreUser.id);
              await auth.updateUser(userRecord.uid, {
                email: firestoreUser.email,
                password: newPassword,
                emailVerified: true
              });
              console.log(`[AUTH SERVICE] Updated existing Firebase Auth profile via UID for: ${email}`);
            } catch (uidErr) {
              if (uidErr.code === 'auth/user-not-found') {
                // CASE 3: Firebase user genuinely missing, provision it
                userRecord = await auth.createUser({
                  uid: firestoreUser.id,
                  email: firestoreUser.email,
                  password: newPassword,
                  emailVerified: true
                });
                console.log(`[AUTH SERVICE] Created missing Firebase Auth profile for: ${email}`);
              } else {
                throw uidErr;
              }
            }
          } else {
             // User genuinely doesn't exist anywhere
             throw err;
          }
        } else {
          throw err;
        }
      }

      emailService.deleteResetToken(email);
      return { success: true };
    } catch (firebaseError) {
      console.error(`[AUTH SERVICE] Error updating Firebase password for ${email}:`, firebaseError);
      if (firebaseError.code === 'auth/user-not-found') {
         // Security: Don't leak whether user exists, just pretend it worked
         emailService.deleteResetToken(email);
         return { success: true }; 
      }
      throw new Error('Failed to update password securely.');
    }
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
