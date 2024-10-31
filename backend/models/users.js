// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    googleId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
