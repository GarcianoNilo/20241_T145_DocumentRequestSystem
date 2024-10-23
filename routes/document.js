const express = require('express');
const router = express.Router();
const documentController = require('./documentController');

// Define CRUD routes for document services
router.get('/documents', documentController.getAllDocuments);
router.get('/documents/:id', documentController.getDocumentById);
router.post('/documents', documentController.uploadDocument);
router.delete('/documents/:id', documentController.deleteDocument);
router.patch('/documents/:id', documentController.updateDocument);
module.exports = router;
