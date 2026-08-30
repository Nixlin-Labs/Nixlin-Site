const express = require('express');
const router = express.Router();
const { handleContactSubmission } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, handleContactSubmission);

module.exports = router;
