const axios = require('axios');
const env = require('../config/env');

/**
 * Service for MSG91 integration
 */
class Msg91Service {
  constructor() {
    this.baseUrl = 'https://control.msg91.com/api/v5';
  }

  /**
   * Sends OTP to a phone number
   * @param {string} phoneNumber - The phone number including country code (e.g., 919876543210 for India)
   * @returns {Promise<Object>} The response from MSG91
   */
  async sendOtp(phoneNumber) {
    try {
      // In a real scenario, you might want to format the number or ensure the country code is correct.
      // MSG91 requires the number with country code without the '+' sign usually, e.g., 919876543210
      const formattedNumber = phoneNumber.replace('+', '');
      
      const response = await axios.post(
        `${this.baseUrl}/otp?template_id=${env.msg91.templateId}&mobile=${formattedNumber}&authkey=${env.msg91.authToken}`
      );
      return response.data;
    } catch (error) {
      console.error('MSG91 Send OTP Error:', error.response?.data || error.message);
      const err = new Error('Failed to send OTP');
      err.statusCode = 500;
      err.errorCode = 'OTP_SEND_FAILED';
      throw err;
    }
  }

  /**
   * Verifies an OTP
   * @param {string} phoneNumber - The phone number
   * @param {string} otp - The OTP to verify
   * @returns {Promise<Object>} The response from MSG91
   */
  async verifyOtp(phoneNumber, otp) {
    try {
      const formattedNumber = phoneNumber.replace('+', '');
      
      const response = await axios.get(
        `${this.baseUrl}/otp/verify?otp=${otp}&mobile=${formattedNumber}&authkey=${env.msg91.authToken}`
      );
      
      if (response.data.type === 'error') {
        const err = new Error(response.data.message || 'Invalid OTP');
        err.statusCode = 400;
        err.errorCode = 'INVALID_OTP';
        throw err;
      }
      
      return response.data;
    } catch (error) {
      console.error('MSG91 Verify OTP Error:', error.response?.data || error.message);
      if (error.statusCode) throw error; // Re-throw our custom error
      
      const err = new Error('Failed to verify OTP');
      err.statusCode = 500;
      err.errorCode = 'OTP_VERIFY_FAILED';
      throw err;
    }
  }
}

module.exports = new Msg91Service();
