// routes/userRoutes.js
const express = require('express');
const { getUser, getAllUsers, updateUser, deleteUser, createUser } = require('../services/userService');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (no authentication check)
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply authentication middleware to all routes below this line
router.use(authenticateUser);

// Get user details by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new user (admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user details by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a user by ID (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
