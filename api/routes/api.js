// routes/api.js
import express from 'express';
import { uploadDocument, getAllDocuments } from '../controllers/documentController.js';
import { queryDocument } from '../controllers/queryController.js';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import authRoutes from '../routes/authRoutes.js'
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.use('/api', authRoutes);
// Document routes
router.post('/documents/upload', upload.single('file'), uploadDocument);
router.get('/documents', getAllDocuments);
router.use('/api', authRoutes);
// Query route
router.post('/query', protect, queryDocument);

export default router;