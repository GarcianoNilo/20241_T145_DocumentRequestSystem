// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true }, // Add googleId field
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
}, { timestamps: true }); // Timestamps will automatically manage createdAt and updatedAt

const User = mongoose.model('User', userSchema);

module.exports = User;
