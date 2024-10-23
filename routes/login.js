const express = require('express');
const router = express.Router();
const loginController = require('../services/login_services');
const passport = require('passport');

// Initiate Google login
router.get('/google', loginController.googleAuth);

// Google callback route
router.get('/auth/google/callback', loginController.googleCallback);

module.exports = router;
