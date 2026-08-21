const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// Public route to submit feedback
router.post('/', feedbackController.sendFeedback);

module.exports = router;
