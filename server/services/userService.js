const User = require('../models/User');

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return user;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
};