// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedBy: { type: Number, ref: 'User', required: true }
    // Uncomment the following lines if needed
    // processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
