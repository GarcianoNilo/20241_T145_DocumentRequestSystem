const Document = require('../models/Document');

const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error getting documents:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const requestDocument = async (req, res) => {
    try {
        const { documentId } = req.body;
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error('Error requesting document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDocuments, requestDocument };