require('./src/config/env');
const authService = require('./src/services/auth.service');
const emailService = require('./src/services/email.service');

async function testFullFlow() {
  const email = 'test_auth_flow@example.com';
  
  try {
    console.log('--- SENDING OTP ---');
    const otp = emailService.generateOtp();
    emailService.storeOtp(email, otp);
    
    // We mocked sendOtpEmail, but authService.sendEmailOtp calls it.
    // Let's just simulate the verify directly since sendEmailOtp is just a wrapper.
    
    console.log(`\n--- VERIFYING OTP with OTP: ${otp} ---`);
    const result = await authService.verifyEmailOtpAndLogin(email, otp);
    console.log('Result:', result);
    console.log('JWT Token successfully generated:', !!result.token);
  } catch (error) {
    console.error('Error during full flow:', error);
  }
}

testFullFlow();
