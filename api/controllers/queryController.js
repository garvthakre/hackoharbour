// controllers/queryController.js
import { queryPinecone } from "../services/pineconeService.js";
import { ChatGroq } from "@langchain/groq";
import { RetrievalQAChain } from "langchain/chains";
import ChatMessage from "../models/chatMessage.js";

// Query a document
const queryDocument = async (req, res, next) => {
  try {
    const { documentId, query, spaceId, model } = req.body;
    const userId = req.user?.id; // Get user ID from auth middleware
    const selectedModel = model || "llama3-70b-8192"; 
    if (!documentId || !query) {
      return res
        .status(400)
        .json({ error: "Document ID and query are required" });
    }

    // Save the user's question to chat history if spaceId is provided
    if (spaceId && userId) {
      await ChatMessage.create({
        spaceId,
        userId,
        type: "question",
        content: query,
      });
    }

    // Get the vector store for the document
    const { vectorStore, document } = await queryPinecone(documentId, query);

    // Initialize Groq client with env variable
    const groq = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: selectedModel,
    });

    // Create a retrieval chain
    const chain = RetrievalQAChain.fromLLM(groq, vectorStore.asRetriever());

    // Execute the query
    const response = await chain.call({
      query: query,
    });

    // Save the AI's answer to chat history if spaceId is provided
    if (spaceId && userId) {
      await ChatMessage.create({
        spaceId,
        userId,
        type: "answer",
        content: response.text,
      });
    }

    res.status(200).json({ answer: response.text });
  } catch (error) {
    next(error);
  }
};

export { queryDocument };
