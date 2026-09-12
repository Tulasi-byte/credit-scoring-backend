const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const {
  createApplicant,
  getApplicant,
  listApplicants,
} = require('../controllers/applicantController');

router.post('/', requireAuth, createApplicant);
router.get('/:id', requireAuth, getApplicant);
router.get('/', requireAuth, listApplicants);

module.exports = router;
