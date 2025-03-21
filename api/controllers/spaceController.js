import Space from '../models/Space.js';
import Document from '../models/document.js';
import { v4 as uuidv4 } from 'uuid';

// Create a new collaborative space
export const createSpace = async (req, res) => {
  try {
    const { name, description, documentId } = req.body;
    const userId = req.user.id;

    // Validate document exists
    const documentExists = await Document.findById(documentId);
    if (!documentExists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Generate unique access token
    const accessToken = uuidv4();

    // Create space
    const space = await Space.create({
      name,
      description,
      documentId,
      accessToken,
      createdBy: userId,
      members: [userId] // Add creator as first member
    });

    res.status(201).json({ 
      message: 'Space created successfully', 
      spaceId: space._id,
      accessToken: space.accessToken
    });
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Join an existing space using access token
export const joinSpace = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const userId = req.user.id;

    // Find space by access token
    const space = await Space.findOne({ accessToken });
    if (!space) {
      return res.status(404).json({ error: 'Invalid access token' });
    }

    // Check if user is already a member
    if (!space.members.includes(userId)) {
      space.members.push(userId);
      await space.save();
    }

    res.status(200).json({ 
      message: 'Joined space successfully', 
      spaceId: space._id 
    });
  } catch (error) {
    console.error('Error joining space:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all spaces for a user
export const getUserSpaces = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all spaces where user is a member
    const spaces = await Space.find({ members: userId })
      .populate('documentId', 'title filename')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ spaces });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific space by ID
export const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find space and check if user is a member
    const space = await Space.findById(id)
      .populate('documentId')
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user is a member of this space
    if (!space.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({ space });
  } catch (error) {
    console.error('Error fetching space:', error);
    res.status(500).json({ error: 'Server error' });
  }
};