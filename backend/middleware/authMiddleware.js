// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Assuming you're using Passport for authentication
        return next();
    }
    res.status(401).json({ message: 'Please log in to access this resource' });
};

// Middleware to check if the user is an admin
const ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Access denied: Admins only' });
};

// Middleware to check if the user is a regular user
const ensureUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    res.status(403).json({ message: 'Access denied: Users only' });
};

module.exports = {
    ensureAuthenticated,
    ensureAdmin,
    ensureUser
};
