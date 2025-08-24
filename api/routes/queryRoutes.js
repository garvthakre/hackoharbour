// api/routes/queryRoutes.js - Create this new file
import express from 'express';
import { queryDocument } from '../controllers/queryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect the query route
router.post('/query', protect, queryDocument);

export default router;