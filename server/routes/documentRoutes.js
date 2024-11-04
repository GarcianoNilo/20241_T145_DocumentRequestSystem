// routes/documentRoutes.js
const express = require('express');
const {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
} = require('../services/documentService');

const router = express.Router();

// Get all documents
router.get('/', getDocuments);

// Get a single document by ID
router.get('/:id', getDocumentById);

// Create a new document
router.post('/', createDocument);

// Update a document by ID
router.patch('/:id', updateDocument);

// Delete a document by ID
router.delete('/:id', deleteDocument);

module.exports = router;
