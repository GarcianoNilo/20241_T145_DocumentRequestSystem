const express = require('express');
const router = express.Router();
const history_services = require('../services/history_services');

router.get('/', history_services.getHistory);
router.get('/user/:userId', history_services.getUserHistory);
router.get('/admin/:adminId', history_services.getAdminHistory);

module.exports = router;
