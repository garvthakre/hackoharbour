// controllers/documentController.js
import { Document } from '../models/index.js';
import { processPdf } from '../services/pineconeService.js';

// Upload and process a PDF document
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const document = await processPdf(req.file.path, req.file.originalname);
    res.status(200).json({ message: 'Document uploaded and processed', document });
    
    console.log("Got Docu", document);
  } catch (error) {
    next(error);
  }
};

// Get all documents
const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

export { uploadDocument, getAllDocuments };