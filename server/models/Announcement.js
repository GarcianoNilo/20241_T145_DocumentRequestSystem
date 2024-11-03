// IN PROGRESS

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String, required: true },
    content: {
        type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    validUntil: { type: Date, required: true },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
