const mongoose = require('mongoose');
const Document = require('../models/document'); // Assuming you're using MongoDB with Mongoose
const Counter = require('../models/counter');

mongoose.connect('mongodb+srv://2201104232:sp4d3kun015@database.dd08g.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Failed to connect to MongoDB Atlas', err));


const getNextSequenceValue = async (sequenceName) => {
    const counter = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return counter.sequence_value;
};

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
    let userId = req.body.requestedBy;

    if (!userId) {
        // Generate new custom user ID
        userId = await getNextSequenceValue('user_id');
        const newUser = new User({
            _id: userId,
            name: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });

        try {
            await newUser.save();
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    // Generate new custom document ID
    const documentId = await getNextSequenceValue('document_id');
    const newDocument = new Document({
        _id: documentId,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        requestedBy: userId
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
