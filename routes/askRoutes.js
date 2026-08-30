const express = require('express');
const router = express.Router();
const { handleAskQuestion } = require('../controllers/askController');
const { askLimiter } = require('../middleware/rateLimiter');

router.post('/', askLimiter, handleAskQuestion);

module.exports = router;
