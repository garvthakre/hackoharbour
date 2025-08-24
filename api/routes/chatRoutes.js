// api/routes/chatRoutes.js - Updated with individual chat routes
import express from 'express';
import { 
  saveMessage, 
  getChatHistory, 
  createChat, 
  getUserChats, 
  getChatById, 
  deleteChat,
  updateChat 
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Individual chat routes
router.post('/create', createChat);           // Create new chat
router.get('/user', getUserChats);            // Get user's chats
router.get('/chat/:chatId', getChatById);     // Get specific chat with messages
router.patch('/chat/:chatId', updateChat);   // Update chat (last activity, etc.)
router.delete('/chat/:chatId', deleteChat);  // Delete a chat

// Legacy routes (for backward compatibility)
router.post('/save', saveMessage);            // Save a new message
router.get('/:spaceId', getChatHistory);      // Get chat history for a space

export default router;