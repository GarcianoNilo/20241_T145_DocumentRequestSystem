const express = require('express');
const router = express.Router();
const document_services = require('../services/document_services');

// Define CRUD routes for document services
router.get('/', document_services.getAllDocuments);
router.get('/:id', document_services.getDocumentById);
router.post('/', document_services.uploadDocument);
router.delete('/:id', document_services.deleteDocument);
router.patch('/:id', document_services.updateDocument);
module.exports = router;
