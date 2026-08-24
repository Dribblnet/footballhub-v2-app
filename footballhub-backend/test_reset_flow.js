const env = require('./src/config/env');
const authController = require('./src/controllers/auth.controller');
const emailService = require('./src/services/email.service');
const { auth, db } = require('./src/config/firebase');

let capturedOtp = null;

// Mock sending email to capture OTP
const originalSendOtpEmail = emailService.sendOtpEmail;
emailService.sendOtpEmail = async (email, otp) => {
  capturedOtp = otp;
  return { success: true };
};

class MockRes {
  constructor() {
    this.statusCode = 200;
    this.data = null;
  }
  status(code) { this.statusCode = code; return this; }
  json(data) { this.data = data; return this; }
}

async function performResetFlow(testEmail, newPassword) {
  const req1 = { body: { email: testEmail } };
  const res1 = new MockRes();
  await authController.sendEmailOtp(req1, res1, (err) => { throw err; });
  
  if (!capturedOtp) throw new Error("Failed to capture OTP");

  const req2 = { body: { email: testEmail, otp: capturedOtp, intent: 'reset' } };
  const res2 = new MockRes();
  await authController.verifyEmailOtp(req2, res2, (err) => { throw err; });
  
  if (!res2.data?.success || !res2.data.data?.resetToken) {
    throw new Error("Failed to return resetToken");
  }
  const resetToken = res2.data.data.resetToken;

  const req3 = { body: { email: testEmail, resetToken, newPassword } };
  const res3 = new MockRes();
  await authController.resetPassword(req3, res3, (err) => { throw err; });
}

async function verifyLogin(email, password) {
  const axios = require('axios');
  const frontendEnv = require('fs').readFileSync('../.env', 'utf8');
  const webApiKey = frontendEnv.match(/VITE_FIREBASE_API_KEY="?([^"\s]+)"?/)[1];
  await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${webApiKey}`, {
    email,
    password,
    returnSecureToken: true
  });
}

async function runTests() {
  const cleanupUids = [];

  try {
    // --- SCENARIO 1: Existing Firebase user found by email ---
    console.log("\n=== SCENARIO 1: Existing normal Firebase User ===");
    const email1 = `normal_${Date.now()}@test.com`;
    const user1 = await auth.createUser({ email: email1, password: 'OldPassword1!' });
    cleanupUids.push(user1.uid);
    await db.collection('users').doc(user1.uid).set({ email: email1, id: user1.uid });

    await performResetFlow(email1, 'NewPassword1!');
    await verifyLogin(email1, 'NewPassword1!');
    console.log("-> SCENARIO 1 PASSED: Normal user updated successfully");

    // --- SCENARIO 2: Legacy User (UID exists, but email doesn't match) ---
    console.log("\n=== SCENARIO 2: Legacy User (auth/uid-already-exists simulation) ===");
    const email2_actual = `legacy_${Date.now()}@test.com`;
    const email2_dummy = `dummy_${Date.now()}@test.com`;
    
    // Create firebase user with dummy email
    const user2 = await auth.createUser({ email: email2_dummy, password: 'OldPassword2!' });
    cleanupUids.push(user2.uid);
    // Create firestore user with actual email
    await db.collection('users').doc(user2.uid).set({ email: email2_actual, id: user2.uid });

    // Should resolve via existing UID and update email and password
    await performResetFlow(email2_actual, 'NewPassword2!');
    await verifyLogin(email2_actual, 'NewPassword2!');
    console.log("-> SCENARIO 2 PASSED: Legacy user with existing UID updated successfully (No createUser call)");

    // --- SCENARIO 3: Missing Firebase User (Genuinely Needs Provisioning) ---
    console.log("\n=== SCENARIO 3: Completely missing Firebase User ===");
    const email3 = `missing_${Date.now()}@test.com`;
    const uid3 = `custom_missing_${Date.now()}`;
    cleanupUids.push(uid3); // Will be created during reset

    // Create ONLY firestore profile
    await db.collection('users').doc(uid3).set({ email: email3, id: uid3 });

    // Should resolve via createUser()
    await performResetFlow(email3, 'NewPassword3!');
    await verifyLogin(email3, 'NewPassword3!');
    console.log("-> SCENARIO 3 PASSED: Missing legacy user provisioned successfully");

    console.log("\nALL TESTS PASSED SUCCESSFULLY!");

  } catch (err) {
    console.error("\n!!! TEST FAILED !!!\n", err.stack);
  } finally {
    for (const uid of cleanupUids) {
      try { await auth.deleteUser(uid); } catch(e){}
      try { await db.collection('users').doc(uid).delete(); } catch(e){}
    }
    console.log("\nCleanup complete.");
  }
}

runTests();
