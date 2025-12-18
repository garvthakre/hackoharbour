import { queryPinecone } from "../services/pineconeService.js";
import { RetrievalQAChain } from "langchain/chains";
import ChatMessage from "../models/chatMessage.js";
import Space from "../models/Space.js";
import Chat from "../models/Chat.js";
import { llmService } from "../services/llmService.js";

// Query a document
const queryDocument = async (req, res, next) => {
  try {
    const { documentId, query, spaceId, model, chatId } = req.body;
    const userId = req.user?.id;
    const selectedModel = model; // llmService handles default if this is null/undefined, or we can pass it explicitly
    
    console.log('=== QUERY DEBUG START ===');
    console.log('Request body:', { documentId, query, spaceId, model, chatId });
    console.log('User ID from auth:', userId);
    
    if (!documentId || !query) {
      console.log('Missing documentId or query');
      return res.status(400).json({ error: "Document ID and query are required" });
    }

    // Validate space access if spaceId is provided (for collaborative spaces)
    if (spaceId && userId) {
      console.log('Validating space access...');
      const space = await Space.findById(spaceId).populate('members');
      
      if (!space) {
        console.log('Space not found in database');
        return res.status(404).json({ error: 'Space not found' });
      }
      
      const isMember = space.members.some(member => member._id.toString() === userId.toString());
      
      if (!isMember) {
        console.log('User is not a member of this space');
        return res.status(403).json({ error: 'Access denied to this space' });
      }
    }

    // Validate chat access if chatId is provided (for individual chats)
    if (chatId && userId) {
      console.log('Validating chat access...');
      const chat = await Chat.findOne({ _id: chatId, userId });
      
      if (!chat) {
        console.log('Chat not found or access denied');
        return res.status(404).json({ error: 'Chat not found or access denied' });
      }
    }

    // Get the vector store for the document
    console.log('Querying Pinecone...');
    const { vectorStore, document } = await queryPinecone(documentId, query);

    // Initialize LLM via service
    console.log('Initializing LLM with model:', selectedModel);
    const groq = llmService.getInstance({
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

    // Save messages if user is authenticated
    let questionMessage = null;
    let answerMessage = null;
    
    if (userId) {
      console.log('Saving messages...');
      console.log('SpaceId:', spaceId);
      console.log('ChatId:', chatId);
      
      try {
        // Save question
        const questionData = {
          userId: userId,
          type: "question",
          content: query,
          timestamp: new Date()
        };

        if (spaceId) {
          questionData.spaceId = spaceId;
          console.log('Saving to space:', spaceId);
        } else if (chatId) {
          questionData.chatId = chatId;
          console.log('Saving to chat:', chatId);
        } else {
          console.log('No spaceId or chatId provided, saving as individual message');
        }

        console.log('Message data to save:', questionData);
        questionMessage = await ChatMessage.create(questionData);
        console.log('Question saved successfully:', questionMessage._id);

        // Save answer
        const answerData = {
          userId: userId,
          type: "answer",
          content: response.text,
          timestamp: new Date()
        };

        if (spaceId) {
          answerData.spaceId = spaceId;
        } else if (chatId) {
          answerData.chatId = chatId;
        } else {
          console.log('No spaceId or chatId provided, saving as individual message');
        }

        console.log('Answer message data to save:', answerData);
        answerMessage = await ChatMessage.create(answerData);
        console.log('Answer saved successfully:', answerMessage._id);

        // Update chat's lastMessageAt if it's an individual chat
        if (chatId) {
          await Chat.findByIdAndUpdate(chatId, { lastMessageAt: new Date() });
        }

      } catch (saveError) {
        console.error('Error saving messages:', saveError);
      }
    }

    console.log('=== QUERY DEBUG END ===');

    // Return the response
    res.status(200).json({ 
      answer: response.text,
      success: true,
      messagesSaved: userId ? true : false,
      debug: {
        questionSaved: !!questionMessage,
        answerSaved: !!answerMessage,
        spaceId,
        chatId,
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