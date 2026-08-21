const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory store for OTPs
// Key: email, Value: { otp: string, expiresAt: number }
const otpStore = new Map();

class EmailService {
  /**
   * Generates a random 6-digit OTP
   * @returns {string} The generated OTP
   */
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Stores the OTP for a given email with a 5-minute expiration
   * @param {string} email 
   * @param {string} otp 
   */
  storeOtp(email, otp) {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
    const normalizedEmail = email.toLowerCase().trim();
    const storedOtp = otp.toString().trim();
    
    // Check if store already has something
    const existing = otpStore.get(normalizedEmail);
    console.log(`[OTP SEND DEBUG] Previous OTP existed for ${normalizedEmail}? ${!!existing}`);
    
    otpStore.set(normalizedEmail, { otp: storedOtp, expiresAt });
    
    console.log(`[OTP SEND DEBUG] -----`);
    console.log(`[OTP SEND DEBUG] Email: ${email} -> Normalized: ${normalizedEmail}`);
    console.log(`[OTP SEND DEBUG] Generated OTP: ${otp} (Type: ${typeof otp})`);
    console.log(`[OTP SEND DEBUG] Stored OTP: ${storedOtp} (Type: ${typeof storedOtp})`);
    console.log(`[OTP SEND DEBUG] Expiration Time: ${new Date(expiresAt).toISOString()}`);
    console.log(`[OTP SEND DEBUG] Map Size: ${otpStore.size}`);
    console.log(`[OTP SEND DEBUG] -----`);
  }

  verifyOtp(email, otp) {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOtp = otp.toString().trim();
    const record = otpStore.get(normalizedEmail);
    
    console.log(`[OTP VERIFY DEBUG] -----`);
    console.log(`[OTP VERIFY DEBUG] Received Email: ${email} -> Normalized: ${normalizedEmail}`);
    console.log(`[OTP VERIFY DEBUG] Received OTP: ${otp} (Type: ${typeof otp}) -> Normalized: ${normalizedOtp}`);
    console.log(`[OTP VERIFY DEBUG] Stored Record Exists: ${!!record}`);
    
    if (record) {
      console.log(`[OTP VERIFY DEBUG] Stored OTP: ${record.otp} (Type: ${typeof record.otp})`);
      console.log(`[OTP VERIFY DEBUG] Stored Email (Key): ${normalizedEmail}`);
      console.log(`[OTP VERIFY DEBUG] Expires At: ${new Date(record.expiresAt).toISOString()} (Current: ${new Date().toISOString()})`);
    }
    
    if (!record) {
      console.log(`[OTP VERIFY DEBUG] Verification Result: FAILURE`);
      console.log(`[OTP VERIFY DEBUG] Reason for failure: OTP record not found in map (Map size: ${otpStore.size})`);
      console.log(`[OTP VERIFY DEBUG] Map Keys:`, Array.from(otpStore.keys()));
      console.log(`[OTP VERIFY DEBUG] -----`);
      return { success: false, message: 'No OTP found for this email. Please request a new one.' };
    }

    if (Date.now() > record.expiresAt) {
      console.log(`[OTP VERIFY DEBUG] Verification Result: FAILURE`);
      console.log(`[OTP VERIFY DEBUG] Reason for failure: OTP expired`);
      console.log(`[OTP VERIFY DEBUG] -----`);
      otpStore.delete(normalizedEmail);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (record.otp === normalizedOtp) {
      console.log(`[OTP VERIFY DEBUG] Verification Result: SUCCESS`);
      console.log(`[OTP VERIFY DEBUG] -----`);
      otpStore.delete(normalizedEmail);
      return { success: true };
    }

    console.log(`[OTP VERIFY DEBUG] Verification Result: FAILURE`);
    console.log(`[OTP VERIFY DEBUG] Reason for failure: OTP mismatch. Expected '${record.otp}', got '${normalizedOtp}'`);
    console.log(`[OTP VERIFY DEBUG] -----`);
    return { success: false, message: 'Incorrect OTP. Please try again.' };
  }

  /**
   * Sends the OTP email using Resend
   * @param {string} email 
   * @param {string} otp 
   */
  async sendOtpEmail(email, otp) {
    const subject = 'Dribbl.net Verification Code';
    const htmlBody = `
      <p>Hello,</p>
      <p>Your Dribbl.net verification code is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 5 minutes.</p>
      <p>If you did not request this code, you can safely ignore this email.</p>
      <p>— Dribbl.net</p>
    `;

    try {
      console.log(`[AUTH DIAGNOSTICS] Resend request started for: ${email.replace(/(?<=^.{2}).*(?=@)/, '***')}`);
      const resendStartTime = Date.now();
      
      const response = await resend.emails.send({
        from: 'Dribbl.net <noreply@dribbl.net>',
        to: email,
        subject: subject,
        html: htmlBody,
      });
      
      console.log(`[AUTH DIAGNOSTICS] Resend response received in ${Date.now() - resendStartTime}ms`);
      if (response && response.data) {
         console.log(`[AUTH DIAGNOSTICS] Resend ID: ${response.data.id}`);
      }
      
      if (response.error) {
        console.error(`[AUTH DIAGNOSTICS] Resend Error: ${response.error.message}`);
        throw new Error(response.error.message || 'Failed to send email via Resend');
      }
      
      return response;
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw error;
    }
  }

  /**
   * Sends a feedback email from a user
   * @param {Object} feedbackData
   */
  async sendFeedbackEmail(feedbackData) {
    const { type, message, name, email } = feedbackData;
    const subject = `Dribbl Feedback — [${type}]`;
    const htmlBody = `
      <h3>New Feedback Received</h3>
      <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="white-space: pre-wrap;">${message}</blockquote>
      <p><strong>Date:</strong> ${new Date().toISOString()}</p>
    `;

    try {
      const response = await resend.emails.send({
        from: 'Dribbl.net Feedback <noreply@dribbl.net>',
        to: 'dribblnet@gmail.com',
        reply_to: email || undefined,
        subject: subject,
        html: htmlBody,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send feedback email');
      }
      return response;
    } catch (error) {
      console.error('Error sending feedback email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
