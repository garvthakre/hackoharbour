// config/pinecone.js
import { Pinecone } from '@pinecone-database/pinecone';

const pineconeIndexName = "pdf-rag-app-1";
const dimension = 384; // dimensionality for all-MiniLM-L6-v2 embeddings

// Initialize Pinecone client
const initPinecone = async () => {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // List existing indexes
    const indexList = await pinecone.listIndexes();
    
    // Check if our index exists
    const indexExists = indexList.indexes.some(index => index.name === pineconeIndexName);
    
    if (!indexExists) {
      console.log(`Creating new Pinecone index: ${pineconeIndexName}`);
      // Create the index - this is an asynchronous operation
      await pinecone.createIndex({
        name: pineconeIndexName,
        dimension: dimension,
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
};

export { pineconeIndexName, initPinecone };