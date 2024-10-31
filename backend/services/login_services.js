const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users'); // Assuming you have a User model

// Configure Passport with Google Strategy
// In login_services.js or the file configuring passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // If the user does not exist, create them with a default role
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                role: 'user' // Default role, you may adjust as needed
            });
        }
        done(null, user); // Attach user with role to the session
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
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const payload = await verifyGoogleToken(token);
        let user = await User.findOne({ googleId: payload.sub });
        if (!user) {
            user = await User.create({
                googleId: payload.sub,
                name: payload.name,
                email: payload.email,
                role: 'user' // or 'admin' based on conditions
            });
        }
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: "Authentication error" });
            res.json({ message: "Login successful", redirectUrl: user.role === 'admin' ? '/admin' : '/user' });
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid login token" });
    }
};

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
