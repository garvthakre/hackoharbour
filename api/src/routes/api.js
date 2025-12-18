// routes/api.js
import express from 'express';
import { uploadDocument, getAllDocuments } from '../controllers/documentController.js';
import { queryDocument } from '../controllers/queryController.js';
import configureFileUpload from '../utils/fileUpload.js';
import { signup, login, getMe } from '../controllers/authController.js'; // Added getMe
import { protect } from '../middleware/authMiddleware.js'; // Restored protect

const router = express.Router();
const upload = configureFileUpload();

// Document routes
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/documents', getAllDocuments);

// Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/user/me', protect, getMe); // Added /user/me route

// Query route
router.post('/query', queryDocument);

export default router;