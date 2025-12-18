
import Chat from '../models/Chat.js';
import ChatMessage from '../models/chatMessage.js';
import { DEFAULT_MODEL } from '../config/llmModels.js';

 
export const createChat = async (req, res) => {
  try {
    console.log(' CREATE CHAT REQUEST');
    console.log(' Request body:', req.body);
    console.log(' User from middleware:', req.user);
    
    const { documentId, title, model } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      console.log(' No userId found in request');
      return res.status(401).json({ error: 'User authentication required' });
    }

    console.log(' Creating chat for user:', userId);
    console.log(' Document ID:', documentId);
    console.log(' Title:', title);
    console.log(' Model:', model);

    const chatData = {
      userId,
      title: title || `Chat ${new Date().toLocaleString()}`,
      model: model || DEFAULT_MODEL
    };

    // Only add documentId if it exists and is not null
    if (documentId) {
      chatData.documentId = documentId;
    }

    console.log(' Final chat data to save:', chatData);

    const newChat = await Chat.create(chatData);
    console.log(' Chat created in DB:', newChat._id);

    // Populate if documentId exists
    if (newChat.documentId) {
      await newChat.populate('documentId', 'title filename');
      console.log(' Populated document info');
    }

    console.log(' Sending response:', newChat);
    res.status(201).json(newChat);
    
  } catch (error) {
    console.error(' Error creating chat:', error);
    console.error(' Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create chat: ' + error.message });
  }
};
// Get user's chats
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ userId })
      .populate('documentId', 'title filename')
      .sort({ lastActivity: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

// Get specific chat with messages
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Find the chat and verify ownership
    const chat = await Chat.findOne({ _id: chatId, userId })
      .populate('documentId', 'title filename');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Get messages for this chat
    const messages = await ChatMessage.find({ chatId })
      .sort({ timestamp: 1 });

    res.json({
      ...chat.toObject(),
      messages
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Delete the chat and its messages
    await Chat.findOneAndDelete({ _id: chatId, userId });
    await ChatMessage.deleteMany({ chatId });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

// Save message to chat (for backward compatibility)
export const saveMessage = async (req, res) => {
  try {
    const { chatId, spaceId, type, content } = req.body;
    const userId = req.user.id;

    const messageData = {
      userId,
      type,
      content,
      timestamp: new Date()
    };

    if (chatId) {
      messageData.chatId = chatId;
      // Update chat's last activity
      await Chat.findByIdAndUpdate(chatId, { lastActivity: new Date() });
    } else if (spaceId) {
      messageData.spaceId = spaceId;
    }

    const message = await ChatMessage.create(messageData);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Get chat history (for backward compatibility)
export const getChatHistory = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { chatId } = req.query;

    let messages;
    
    if (chatId) {
      messages = await ChatMessage.find({ chatId })
        .populate('userId', 'name email')
        .sort({ timestamp: 1 });
    } else if (spaceId) {
      messages = await ChatMessage.find({ spaceId })
        .populate('userId', 'name email')
        .sort({ timestamp: 1 });
    } else {
      return res.status(400).json({ error: 'Either chatId or spaceId required' });
    }

    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

 export const updateChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { title, lastMessageAt: new Date() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error updating chat title:', error);
    next(error);
  }
};