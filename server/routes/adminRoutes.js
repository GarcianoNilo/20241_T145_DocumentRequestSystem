// IN PROGRESS
const express = require('express');
const router = express.Router();
const admin_services = require('../services/adminServices');

router.get('/admin', (req, res) => {
    res.send('Welcome, Admin');
});

router.get('/dashboard', admin_services.dashboard);
router.get('/documents-request', admin_services.documentsRequest);
router.get('/account', admin_services.adminAccount);

module.exports = router;
