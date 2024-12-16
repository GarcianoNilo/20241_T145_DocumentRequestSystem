const express = require('express');
const router = express.Router();
const Lock = require('../models/Lock');

// Get edit lock status
router.get('/edit_user', async (req, res) => {
    try {
        const lock = await Lock.findOne({ button: 'edit_user' });
        res.json(lock || { isLocked: false, userID: null });
    } catch (error) {
        console.error('Error getting lock status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update edit lock status
router.patch('/edit_user', async (req, res) => {
    try {
        const { isLocked, userID } = req.body;
        
        const lock = await Lock.findOneAndUpdate(
            { button: 'edit_user' },
            { 
                isLocked,
                userID,
                lockTime: isLocked ? Date.now() : null
            },
            { new: true, upsert: true }
        );

        res.json(lock);
    } catch (error) {
        console.error('Error updating lock status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
