// IN PROGRESS
const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

router.get('/announcement', async (req, res) => {
  try {
    const announcement = await Announcement.findOne();
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

module.exports = router;
