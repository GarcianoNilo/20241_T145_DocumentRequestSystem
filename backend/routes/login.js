// routes/login.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users'); // Import the User model

// Google Auth route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback route
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    try {
        // Check if the authenticated user's email exists in the database
        const user = await User.findOne({ email: req.user.email });

        if (user) {
            // Redirect based on the user's role
            if (user.role === 'admin') {
                res.redirect('/admin-dashboard'); // Update to the actual admin dashboard URL
            } else {
                res.redirect('/user-dashboard'); // Update to the actual user dashboard URL
            }
        } else {
            // Handle if the user is not found
            res.status(403).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        console.error('Error in Google callback:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
