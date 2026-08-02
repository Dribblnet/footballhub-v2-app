require('dotenv').config();
const emailService = require('./src/services/email.service');

async function test() {
  try {
    console.log('Sending test email OTP...');
    const otp = emailService.generateOtp();
    const result = await emailService.sendOtpEmail('delivered@resend.dev', otp);
    console.log('Test result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
