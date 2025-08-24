// models/Chat.js - Individual chat model for PDFRag
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: false // Allow chats without specific documents
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat'
  },
  model: {
    type: String,
    default: 'llama3-70b-8192'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, isActive: 1, lastMessageAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;