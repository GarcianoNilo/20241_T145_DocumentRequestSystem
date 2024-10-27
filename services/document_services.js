const Document = require('../models/document'); // Assuming you're using MongoDB with Mongoose

// Get all documents
const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a document by ID
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (document) {
            res.json(document);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upload a new document
const uploadDocument = async (req, res) => {
    const newDocument = new Document({
        title: req.body.title,
        content: req.body.content
    });
    try {
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a document by ID
const deleteDocument = async (req, res) => {
    try {
        const deletedDocument = await Document.findByIdAndDelete(req.params.id);
        if (deletedDocument) {
            res.send(`Document with ID ${req.params.id} deleted`);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a document by ID
const updateDocument = async (req, res) => {
    try {
        const updatedDocument = await Document.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, content: req.body.content },
            { new: true } // Ensures the updated document is returned
        );
        if (updatedDocument) {
            res.json(updatedDocument);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Export all methods
module.exports = {
    getAllDocuments,
    getDocumentById,
    uploadDocument,
    deleteDocument,
    updateDocument
};
