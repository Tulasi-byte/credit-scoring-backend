const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { scoreApplicant } = require('../controllers/scoreController');

router.post('/', requireAuth, scoreApplicant);

module.exports = router;
