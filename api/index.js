// index.js -> Version 1.0.0
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChatGroq } from '@langchain/groq';
import { RetrievalQAChain } from 'langchain/chains';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ragapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Document Schema
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

// Initialize Groq client
const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
   modelName: "llama3-70b-8192", // Or any other model offered by Groq
});

// Initialize HuggingFace embeddings model
// Replace OpenAI embeddings with HuggingFace embeddings
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2", // A good general purpose embedding model
  maxRetries: 5, // Add retries for stability
});

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndexName = "pdf-rag-app-1";

// Ensure Pinecone index exists
async function initPinecone() {
    try {
      // List existing indexes
      const indexList = await pinecone.listIndexes();
      
      // Check if our index exists
      const indexExists = indexList.indexes.some(index => index.name === pineconeIndexName);
      
      if (!indexExists) {
        console.log(`Creating new Pinecone index: ${pineconeIndexName}`);
        // Create the index - this is an asynchronous operation
        await pinecone.createIndex({
          name: pineconeIndexName,
          dimension: 384, // dimensionality for all-MiniLM-L6-v2 embeddings (384 instead of 1536)
          metric: 'cosine',
          spec: { 
            serverless: { 
              cloud: 'aws', 
              region: 'us-east-1' 
            }
          } 
        });
        
        // Wait a moment for the index to be ready
        console.log("Waiting for index to be ready...");
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
      
      console.log("Pinecone initialized successfully");
      return pinecone.Index(pineconeIndexName);
    } catch (error) {
      console.error("Error initializing Pinecone:", error);
      throw error;
    }
}

// Modified processPdf function to use HuggingFace embeddings
async function processPdf(filePath, filename) {
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
    
    // Use Langchain's built-in vector store creation which handles batching
    const vectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: namespace,
        maxConcurrency: 5, // Limit concurrent requests
      }
    );
    
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
}

// Endpoint to upload and process PDF
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const document = await processPdf(req.file.path, req.file.originalname);
    res.status(200).json({ message: 'Document uploaded and processed', document });
    
  } catch (error) {
    console.error("Error in upload endpoint:", error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

// Get all documents endpoint
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Query document endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { documentId, query } = req.body;
    
    if (!documentId || !query) {
      return res.status(400).json({ error: 'Document ID and query are required' });
    }
    
    // Get document from MongoDB
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Get Pinecone index
    const index = pinecone.Index(document.indexName);
    
    // Load the vector store
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: document.namespace
    });
    
    // Create a retrieval chain
    const chain = RetrievalQAChain.fromLLM(groq, vectorStore.asRetriever());
    
    // Execute the query
    const response = await chain.call({
      query: query
    });
    
    res.status(200).json({ answer: response.text });
    
  } catch (error) {
    console.error("Error in query endpoint:", error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Create a simple frontend for development
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PDF RAG App with Pinecone</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .card { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 5px; }
        input, button, textarea { margin: 10px 0; padding: 8px; width: 100%; }
        button { background-color: #4CAF50; color: white; border: none; cursor: pointer; }
        #documents { margin-top: 20px; }
        .document-item { padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; }
        .document-item:hover { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>PDF RAG Application with Pinecone</h1>
        
        <div class="card">
          <h2>Upload a PDF</h2>
          <form id="uploadForm">
            <input type="file" id="pdfFile" accept=".pdf" required>
            <button type="submit">Upload & Process</button>
          </form>
          <div id="uploadStatus"></div>
        </div>
        
        <div class="card">
          <h2>Your Documents</h2>
          <div id="documents">Loading...</div>
        </div>
        
        <div class="card">
          <h2>Ask Questions</h2>
          <div>
            <p>Selected Document: <span id="selectedDoc">None</span></p>
            <textarea id="queryInput" placeholder="Ask a question about the selected document..." rows="3"></textarea>
            <button id="queryBtn" disabled>Ask</button>
            <div id="queryResult"></div>
          </div>
        </div>
      </div>

      <script>
        let selectedDocId = null;

        // Load documents on page load
        fetchDocuments();

        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const fileInput = document.getElementById('pdfFile');
          const status = document.getElementById('uploadStatus');
          
          if (!fileInput.files[0]) {
            status.textContent = 'Please select a file.';
            return;
          }
          
          const formData = new FormData();
          formData.append('pdf', fileInput.files[0]);
          
          status.textContent = 'Uploading and processing...';
          
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });
            
            const result = await response.json();
            if (response.ok) {
              status.textContent = 'Document processed successfully!';
              fileInput.value = '';
              fetchDocuments();
            } else {
              status.textContent = 'Error: ' + result.error;
            }
          } catch (error) {
            status.textContent = 'Upload failed: ' + error.message;
          }
        });

        document.getElementById('queryBtn').addEventListener('click', async () => {
          const query = document.getElementById('queryInput').value.trim();
          const resultDiv = document.getElementById('queryResult');
          
          if (!query) {
            resultDiv.textContent = 'Please enter a question.';
            return;
          }
          
          if (!selectedDocId) {
            resultDiv.textContent = 'Please select a document first.';
            return;
          }
          
          resultDiv.textContent = 'Processing query...';
          
          try {
            const response = await fetch('/api/query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                documentId: selectedDocId,
                query: query
              })
            });
            
            const result = await response.json();
            if (response.ok) {
              resultDiv.innerHTML = '<strong>Answer:</strong><br>' + result.answer;
            } else {
              resultDiv.textContent = 'Error: ' + result.error;
            }
          } catch (error) {
            resultDiv.textContent = 'Query failed: ' + error.message;
          }
        });

        async function fetchDocuments() {
          const docsDiv = document.getElementById('documents');
          
          try {
            const response = await fetch('/api/documents');
            const documents = await response.json();
            
            if (documents.length === 0) {
              docsDiv.textContent = 'No documents yet. Upload one to get started.';
              return;
            }
            
            docsDiv.innerHTML = '';
            documents.forEach(doc => {
              const docEl = document.createElement('div');
              docEl.className = 'document-item';
              docEl.textContent = doc.title;
              docEl.addEventListener('click', () => {
                // Highlight selected document
                document.querySelectorAll('.document-item').forEach(el => {
                  el.style.backgroundColor = '';
                });
                docEl.style.backgroundColor = '#e0f7e0';
                
                // Set as selected document
                selectedDocId = doc._id;
                document.getElementById('selectedDoc').textContent = doc.title;
                document.getElementById('queryBtn').disabled = false;
              });
              docsDiv.appendChild(docEl);
            });
          } catch (error) {
            docsDiv.textContent = 'Failed to load documents: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});