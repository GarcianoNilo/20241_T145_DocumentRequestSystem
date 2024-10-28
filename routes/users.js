// routes/users.js
const express = require('express');
const User = require('../models/users');
const Counter = require('../models/counter');
const router = express.Router();

const getNextSequenceValue = async (sequenceName) => {
    const counter = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return counter.sequence_value;
};

// Create a new user
router.post('/', async (req, res) => {
    try {
        const userId = await getNextSequenceValue('user_id');
        const user = new User({ _id: userId, ...req.body });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
