const express = require('express');
const HealthController = require('../controllers/HealthController');

const router = express.Router();

router.get('/health', HealthController.getHealth);

module.exports = router;
