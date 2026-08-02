require('./src/config/env'); // Load environment variables first
const emailService = require('./src/services/email.service');

const email = 'testuser@example.com';
const otp = emailService.generateOtp();

console.log('--- SENDING OTP ---');
emailService.storeOtp(email, otp);

console.log('\n--- VERIFYING OTP ---');
const isValid = emailService.verifyOtp(email, otp);
console.log('Result:', isValid ? 'SUCCESS' : 'FAILED');

console.log('\n--- VERIFYING SAME OTP AGAIN (Should fail because it was deleted) ---');
const isSecondValid = emailService.verifyOtp(email, otp);
console.log('Result:', isSecondValid ? 'SUCCESS' : 'FAILED');
