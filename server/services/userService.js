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
const createUser = async (data) => {
    try {
        const user = new User(data);
        await user.save();
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
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
