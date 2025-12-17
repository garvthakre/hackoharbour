import { Groq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { queryPinecone } from '../services/pineconeService.js';
import ChatMessage from '../models/ChatMessage.js';
import Space from '../models/Space.js';

export const queryDocument = async (req, res) => {
  try {
    const { documentId, query, spaceId } = req.body;
    const userId = req.user?.id; // Get user ID if authenticated

    // Validate that the user has access to this space if provided
    if (spaceId && userId) {
      const space = await Space.findById(spaceId);
      if (!space || !space.members.includes(userId)) {
        return res.status(403).json({ error: 'You do not have access to this space' });
      }
    }

    // Query the document from Pinecone
    const { vectorStore, document } = await queryPinecone(documentId, query);
    
    // Get relevant document content
    const results = await vectorStore.similaritySearch(query, 4);
    
    // If there are no relevant results
    if (!results.length) {
      return res.status(404).json({ 
        error: "No relevant information found in the document" 
      });
    }

    // Create context for LLM
    const context = results.map(res => res.pageContent).join('\n\n');
    
    // Format prompt for the LLM
    const prompt = PromptTemplate.fromTemplate(
      `You are an assistant specialized in answering questions based on specific document content.
      
      CONTEXT:
      {context}
      
      QUESTION:
      {query}
      
      Your task is to answer the user's question based ONLY on the provided context. 
      If the context doesn't contain the information to answer the question fully, 
      say "I don't have enough information to answer that question based on the document content." 
      Do not make up or infer information that is not in the context.
      
      Answer:`
    );
    
    // Initialize the LLM
    const llm = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
    });
    
    // Generate the answer
    const promptInput = await prompt.format({ context, query });
    const result = await llm.invoke(promptInput);
    const answer = result.trim();

    // If spaceId is provided, save both question and answer to chat history
    if (spaceId && userId) {
      // Save user question
      await ChatMessage.create({
        spaceId,
        userId,
        type: 'question',
        content: query,
        timestamp: new Date()
      });

      // Save AI answer (use the same user ID as the questioner for simplicity)
      await ChatMessage.create({
        spaceId,
        userId,
        type: 'answer',
        content: answer,
        timestamp: new Date()
      });
    }
    
    // Return the answer
    res.json({ answer });
    
  } catch (error) {
    console.error('Error querying document:', error);
    res.status(500).json({ error: error.message || 'Failed to process query' });
  }
};