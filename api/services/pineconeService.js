// services/pineconeService.js
import path from 'path';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '../models/index.js';
import { pineconeIndexName, initPinecone } from '../config/pinecone.js';
import createEmbeddingsService from './embeddingService.js';

const embeddings = createEmbeddingsService();

// Process PDF and store in Pinecone
const processPdf = async (filePath, filename) => {
  try {
    // Load PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    // Split text into smaller chunks for better processing
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,    // Smaller chunks for better context
      chunkOverlap: 100  // Some overlap for context preservation
    });
    const splitDocs = await textSplitter.splitDocuments(docs);
    
    // Generate a unique namespace for this document
    const namespace = `doc-${Date.now()}`;
    
    // Get Pinecone index
    const index = await initPinecone();
    
    console.log(`Processing ${splitDocs.length} chunks with Hugging Face embeddings`);
    // npm install @huggingface/inference@latest
    // Use Langchain's built-in vector store creation which handles batching
    console.log("Going to Vector Store")
    const vectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: namespace,
        maxConcurrency: 5, // Limit concurrent requests
      }
    );
        console.log("Vector Store Done")

    console.log(`Successfully processed ${splitDocs.length} chunks with Hugging Face embeddings`);
    
    // Save document metadata in MongoDB
    const document = new Document({
      title: path.basename(filename, path.extname(filename)),
      filename: path.basename(filePath),
      indexName: pineconeIndexName,
      namespace: namespace,
      processedChunks: splitDocs.length,
      totalChunks: splitDocs.length
    });
    
    await document.save();
    return document;
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
};

// Query Pinecone for a specific document
const queryPinecone = async (documentId, query) => {
  try {
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // Get document from MongoDB
    const document = await Document.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Get Pinecone index
    const index = pinecone.Index(document.indexName);
    
    // Load the vector store
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: document.namespace
    });
    
    return { vectorStore, document };
    
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw error;
  }
};

export { processPdf, queryPinecone };