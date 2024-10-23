const express = require('express');
const router = express.Router();
const users_services = require('../services/users_services');



router.get('/users', (req, res) => {
    res.send('Welcome, User');
});


router.get('/dashboard', users_services.dashboard);
router.get('/documents', users_services.userDocuments);
router.get('/request-history', users_services.requestHistory);
router.get('/account', users_services.userAccount);

module.exports = router;
