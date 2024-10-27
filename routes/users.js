// routes/document.js
const express = require('express');
const Document = require('../models/document');

const router = express.Router();

// Create a new document
router.post('/', async (req, res) => {
    try {
        const document = new Document(req.body);
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Additional document routes (e.g., update, delete) can go here

module.exports = router;
