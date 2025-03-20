// routes/api.js
import express from 'express';
import { uploadDocument, getAllDocuments } from '../controllers/documentController.js';
import { queryDocument } from '../controllers/queryController.js';
import configureFileUpload from '../utils/fileUpload.js';

const upload = configureFileUpload();
const router = express.Router();

// Document routes
router.post('/upload', upload.single('pdf'), uploadDocument);
router.get('/documents', getAllDocuments);

// Query route
router.post('/query', queryDocument);

export default router;