// services/userService.js
const User = require('../models/User');

// Get user by ID
const getUser = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

// Get all users
const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

// Create a new user
const createUser = async (req, res) => {
    const { email, role, name, picture } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ email, role, name, picture });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user by ID
const updateUser = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete user by ID
const deleteUser = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        return user;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = {
    getUser,
    getAllUsers,
    createUser,  // Export the new function
    updateUser,
    deleteUser
};
