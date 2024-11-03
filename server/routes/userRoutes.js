const express = require('express');
const { getUser, updateUser, deleteUser, getAllUsers } = require('../services/userService');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (no authentication check)
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers(req, res);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply authentication middleware to all routes below this line
router.use(authenticateUser);

// Get user details
router.get('/:id', async (req, res) => {
    try {
        const user = await getUser(req, res);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user details
router.put('/:id', async (req, res) => {
    try {
        const user = await updateUser(req, res);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a user (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const user = await deleteUser(req, res);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;