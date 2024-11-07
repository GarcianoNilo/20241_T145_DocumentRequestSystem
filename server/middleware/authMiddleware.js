// middleware/authMiddleware.js
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Middleware to authenticate with Google token and issue JWT
const authenticateUser = (req, res, next) => {
    passport.authenticate('google-token', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid Google token' });
        }

        // Generate a JWT with user ID and role
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        req.user = user;
        req.token = token;
        next();
    })(req, res, next);
};

// Middleware to verify JWT and check if user is an admin
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
        }

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = { authenticateUser, isAdmin };
