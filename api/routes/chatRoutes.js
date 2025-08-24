// api/routes/chatRoutes.js - Make sure this exists
import express from 'express';
import { saveMessage, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Save a new message
router.post('/save', saveMessage);

// Get chat history for a space  
router.get('/:spaceId', getChatHistory);

export default router;