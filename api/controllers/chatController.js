import ChatMessage from '../models/ChatMessage.js';
import Space from '../models/Space.js';

// Save a new chat message
export const saveMessage = async (req, res) => {
  try {
    const { spaceId, type, content } = req.body;
    const userId = req.user.id;

    // Verify the space exists and user is a member
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user is a member of this space
    if (!space.members.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create and save the message
    const message = await ChatMessage.create({
      spaceId,
      userId,
      type,
      content,
      timestamp: new Date()
    });

    // Populate user information before sending response
    const populatedMessage = await ChatMessage.findById(message._id).populate('userId', 'name email');

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get chat history for a space
export const getChatHistory = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const userId = req.user.id;

    // Verify the space exists and user is a member
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user is a member of this space
    if (!space.members.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get messages for this space, sorted by timestamp
    const messages = await ChatMessage.find({ spaceId })
      .sort({ timestamp: 1 })
      .populate('userId', 'name email')
      .lean();

    // Format messages for client
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp,
      user: {
        id: msg.userId._id,
        name: msg.userId.name,
        email: msg.userId.email
      }
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};