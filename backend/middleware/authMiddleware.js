// middleware/authMiddleware.js
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Please log in to access this resource' });
};

const ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Access denied: Admins only' });
};

// You may also have ensureUser defined, depending on your needs

module.exports = {
    ensureAuthenticated,
    ensureAdmin,
    // ensureUser, // Uncomment if used
};
