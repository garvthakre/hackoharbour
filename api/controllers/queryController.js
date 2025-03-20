// controllers/queryController.js
import { queryPinecone } from '../services/pineconeService.js';
import { ChatGroq } from '@langchain/groq';
import { RetrievalQAChain } from 'langchain/chains';

// Query a document
const queryDocument = async (req, res, next) => {
  try {
    const { documentId, query } = req.body;
    
    if (!documentId || !query) {
      return res.status(400).json({ error: 'Document ID and query are required' });
    }
    
    // Get the vector store for the document
    const { vectorStore, document } = await queryPinecone(documentId, query);
    
    // Initialize Groq client
    const groq = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: "llama3-70b-8192", // Or any other model offered by Groq
    });
    
    // Create a retrieval chain
    const chain = RetrievalQAChain.fromLLM(groq, vectorStore.asRetriever());
    
    // Execute the query
    const response = await chain.call({
      query: query
    });
    
    res.status(200).json({ answer: response.text });
    
  } catch (error) {
    next(error);
  }
};

export { queryDocument };