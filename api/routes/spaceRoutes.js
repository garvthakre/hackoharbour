import express from 'express';
import { createSpace, joinSpace, getUserSpaces, getSpaceById } from '../controllers/spaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// Create a new space
router.post('/create', createSpace);

// Join existing space
router.post('/join', joinSpace);

// Get user's spaces
router.get('/', getUserSpaces);

// Get specific space by ID
router.get('/:id', getSpaceById);

export default router;