const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authenticateUser middleware:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { authenticateUser, isAdmin };