// models/document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: String,
  filename: String,
  uploadDate: { type: Date, default: Date.now },
  indexName: String, // Pinecone index name
  namespace: String,  // Pinecone namespace
  processedChunks: Number,
  totalChunks: Number
});

const Document = mongoose.model('Document', documentSchema);

export default Document;