const emailService = require('../services/email.service');
const { successResponse } = require('../utils/response.util');

class FeedbackController {
  async sendFeedback(req, res, next) {
    try {
      const { type, message, name, email } = req.body;
      
      if (!message || !message.trim()) {
        const error = new Error('Feedback message is required');
        error.statusCode = 400;
        throw error;
      }

      await emailService.sendFeedbackEmail({ type, message, name, email });
      
      return successResponse(res, { success: true }, 'Feedback sent successfully');
    } catch (error) {
      console.error('[FEEDBACK CONTROLLER] Error sending feedback:', error);
      next(error);
    }
  }
}

module.exports = new FeedbackController();
