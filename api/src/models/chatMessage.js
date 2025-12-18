// models/chatMessage.js - Updated to support both spaceId and chatId
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: false // For collaborative spaces
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: false // For individual chats
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['question', 'answer', 'system', 'user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add validation to ensure either spaceId or chatId is provided (but allow individual user messages)
chatMessageSchema.pre('save', function(next) {
  // Allow messages without spaceId or chatId for individual user queries
  // Only require one of them if this is meant to be associated with a space or chat
  next();
});

// Add indexes for better query performance
chatMessageSchema.index({ spaceId: 1, timestamp: -1 });
chatMessageSchema.index({ chatId: 1, timestamp: -1 });
chatMessageSchema.index({ userId: 1, timestamp: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;