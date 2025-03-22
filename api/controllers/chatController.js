import ChatMessage from '../models/chatMessage.js';
import User from '../models/User.js';
import Space from '../models/Space.js';

// Save a new chat message
export const saveMessage = async (req, res) => {
  try {
    const { spaceId, type, content } = req.body;
    const userId = req.user.id;

    // Validate space exists and user is a member
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user is a member of this space
    if (!space.members.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create new chat message
    const message = await ChatMessage.create({
      spaceId,
      userId,
      type,
      content
    });

    // Populate user information
    const populatedMessage = await ChatMessage.findById(message._id).populate('userId', 'name email');

    res.status(201).json({ 
      message: 'Message saved successfully',
      data: {
        id: populatedMessage._id,
        type: populatedMessage.type,
        content: populatedMessage.content,
        timestamp: populatedMessage.timestamp,
        user: populatedMessage.userId
      }
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get chat history for a specific space
export const getChatHistory = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const userId = req.user.id;

    // Validate space exists and user is a member
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user is a member of this space
    if (!space.members.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get messages for this space
    const messages = await ChatMessage.find({ spaceId })
      .sort({ timestamp: 1 })
      .populate('userId', 'name email');

    // Format the messages
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp,
      user: msg.userId
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};