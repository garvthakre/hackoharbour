import express from 'express';
import { saveMessage, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get chat history for a space
router.get('/:spaceId', getChatHistory);

// Save a new message
router.post('/', saveMessage);

export default router;