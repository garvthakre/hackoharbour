// controllers/queryController.js - Debug version
import { queryPinecone } from "../services/pineconeService.js";
import { ChatGroq } from "@langchain/groq";
import { RetrievalQAChain } from "langchain/chains";
import ChatMessage from "../models/chatMessage.js";
import Space from "../models/Space.js";

// Query a document
const queryDocument = async (req, res, next) => {
  try {
    const { documentId, query, spaceId, model } = req.body;
    const userId = req.user?.id;
    const selectedModel = model || "llama3-70b-8192";
    
    console.log('=== QUERY DEBUG START ===');
    console.log('Request body:', { documentId, query, spaceId, model });
    console.log('User ID from auth:', userId);
    console.log('User object:', req.user);
    
    if (!documentId || !query) {
      console.log('Missing documentId or query');
      return res.status(400).json({ error: "Document ID and query are required" });
    }

    // Validate space access if spaceId is provided
    if (spaceId && userId) {
      console.log('Validating space access...');
      const space = await Space.findById(spaceId).populate('members');
      console.log('Found space:', space ? space.name : 'NOT FOUND');
      console.log('Space members:', space ? space.members.map(m => m._id.toString()) : []);
      console.log('User ID to check:', userId);
      
      if (!space) {
        console.log('Space not found in database');
        return res.status(404).json({ error: 'Space not found' });
      }
      
      const isMember = space.members.some(member => member._id.toString() === userId.toString());
      console.log('Is user a member?', isMember);
      
      if (!isMember) {
        console.log('User is not a member of this space');
        return res.status(403).json({ error: 'Access denied to this space' });
      }
    }

    // Save the user's question to chat history if spaceId is provided
    let questionMessage = null;
    if (spaceId && userId) {
      console.log('Saving question message...');
      try {
        questionMessage = await ChatMessage.create({
          spaceId: spaceId,
          userId: userId,
          type: "question",
          content: query,
          timestamp: new Date()
        });
        console.log('Question saved successfully:', questionMessage._id);
        console.log('Question details:', {
          id: questionMessage._id,
          spaceId: questionMessage.spaceId,
          userId: questionMessage.userId,
          type: questionMessage.type,
          content: questionMessage.content
        });
      } catch (saveError) {
        console.error('Error saving question:', saveError);
      }
    } else {
      console.log('Skipping question save - missing spaceId or userId');
    }

    // Get the vector store for the document
    console.log('Querying Pinecone...');
    const { vectorStore, document } = await queryPinecone(documentId, query);

    // Initialize Groq client
    console.log('Initializing Groq with model:', selectedModel);
    const groq = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: selectedModel,
      temperature: 0.1,
    });

    // Create a retrieval chain
    const chain = RetrievalQAChain.fromLLM(groq, vectorStore.asRetriever({
      k: 4,
    }));

    // Execute the query
    console.log('Executing query...');
    const response = await chain.call({ query: query });
    console.log('AI Response generated, length:', response.text.length);

    // Save the AI's answer to chat history if spaceId is provided
    let answerMessage = null;
    if (spaceId && userId) {
      console.log('Saving answer message...');
      try {
        answerMessage = await ChatMessage.create({
          spaceId: spaceId,
          userId: userId,
          type: "answer",
          content: response.text,
          timestamp: new Date()
        });
        console.log('Answer saved successfully:', answerMessage._id);
        console.log('Answer details:', {
          id: answerMessage._id,
          spaceId: answerMessage.spaceId,
          userId: answerMessage.userId,
          type: answerMessage.type,
          contentLength: answerMessage.content.length
        });
      } catch (saveError) {
        console.error('Error saving answer:', saveError);
      }
    } else {
      console.log('Skipping answer save - missing spaceId or userId');
    }

    // Verify messages were saved by querying them back
    if (spaceId) {
      console.log('Verifying saved messages...');
      const savedMessages = await ChatMessage.find({ spaceId }).sort({ timestamp: -1 }).limit(5);
      console.log('Recent messages in space:', savedMessages.length);
      savedMessages.forEach(msg => {
        console.log(`- ${msg.type}: ${msg.content.substring(0, 50)}... (${msg.timestamp})`);
      });
    }

    console.log('=== QUERY DEBUG END ===');

    // Return the response
    res.status(200).json({ 
      answer: response.text,
      success: true,
      messagesSaved: spaceId && userId ? true : false,
      debug: {
        questionSaved: !!questionMessage,
        answerSaved: !!answerMessage,
        spaceId,
        userId
      }
    });
    
  } catch (error) {
    console.error('=== ERROR in queryDocument ===');
    console.error(error);
    console.error('=== END ERROR ===');
    next(error);
  }
};

export { queryDocument };