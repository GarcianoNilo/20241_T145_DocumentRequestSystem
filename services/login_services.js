const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // Assuming you have a User model

// Configure Passport with Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    // Find or create the user in the database
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({ googleId: profile.id, name: profile.displayName, role: 'user' });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Handle Google Auth for Login
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google Auth Callback
const googleCallback = passport.authenticate('google', { failureRedirect: '/' }, (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin');
    } else {
        res.redirect('/user');
    }
});

module.exports = {
    googleAuth,
    googleCallback
};
