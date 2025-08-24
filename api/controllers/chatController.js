import ChatMessage from '../models/chatMessage.js';
import User from '../models/User.js';
import Space from '../models/Space.js';

// Get chat history for a specific space
export const getChatHistory = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const userId = req.user.id;

 
    console.log('Requested spaceId:', spaceId);
    console.log('User ID:', userId);
    console.log('User object:', req.user);

    // Validate space exists and user is a member
    const space = await Space.findById(spaceId).populate('members');
    console.log('Found space:', space ? space.name : 'NOT FOUND');
    
    if (!space) {
      console.log('Space not found');
      return res.status(404).json({ error: 'Space not found' });
    }

    // Check if user is a member of this space
    const isMember = space.members.some(member => member._id.toString() === userId.toString());
    console.log('Is user a member?', isMember);
    console.log('Space members:', space.members.map(m => ({ id: m._id.toString(), name: m.name })));
    
    if (!isMember) {
      console.log('Access denied - user not a member');
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get ALL messages for this space first (for debugging)
    const allMessages = await ChatMessage.find({ spaceId });
    console.log('Total messages in space:', allMessages.length);
    allMessages.forEach(msg => {
      console.log(`Message: ${msg.type} - ${msg.content.substring(0, 30)}... - ${msg.timestamp}`);
    });

    // Get messages for this space with populated user data
    const messages = await ChatMessage.find({ spaceId })
      .sort({ timestamp: 1 })
      .populate('userId', 'name email');

    console.log('Messages found with populated user:', messages.length);
    
    // Format the messages
    const formattedMessages = messages.map(msg => {
      console.log('Formatting message:', {
        id: msg._id,
        type: msg.type,
        hasUser: !!msg.userId,
        userName: msg.userId ? msg.userId.name : 'NO USER'
      });
      
      return {
        id: msg._id,
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        user: msg.userId
      };
    });

    console.log('Formatted messages count:', formattedMessages.length);
 

    res.status(200).json({ 
      messages: formattedMessages,
      debug: {
        totalFound: messages.length,
        spaceId,
        userId
      }
    });
  } catch (error) {
    console.error('=== ERROR in getChatHistory ===');
    console.error(error);
    console.error('=== END ERROR ===');
    res.status(500).json({ error: 'Server error' });
  }
};

// Save a new chat message
export const saveMessage = async (req, res) => {
  try {
    const { spaceId, type, content } = req.body;
    const userId = req.user.id;
 
    console.log('Save request:', { spaceId, type, content, userId });

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

    console.log('Message created:', message._id);

    // Populate user information
    const populatedMessage = await ChatMessage.findById(message._id).populate('userId', 'name email');

    console.log('=== SAVE MESSAGE DEBUG END ===');

    res.status(201).json({ 
      message: 'Message saved successfully',
      data: {
        chatMessage: {
          id: populatedMessage._id,
          type: populatedMessage.type,
          content: populatedMessage.content,
          timestamp: populatedMessage.timestamp,
          user: populatedMessage.userId
        },
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        },
        space: {
          id: space._id,
          name: space.name,
          members: space.members.map(m => ({
            id: m._id,
            name: m.name,
            email: m.email
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};