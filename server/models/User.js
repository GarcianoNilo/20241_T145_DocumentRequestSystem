const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, default: 'user' },
        picture: { type: String }, // Optional: to store the profile picture URL from Google
    },
    {
        timestamps: true,  // Automatically creates 'createdAt' and 'updatedAt' fields
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
