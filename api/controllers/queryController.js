// controllers/queryController.js
import { queryPinecone } from "../services/pineconeService.js";
import { ChatGroq } from "@langchain/groq";
import { RetrievalQAChain } from "langchain/chains";
import ChatMessage from "../models/chatMessage.js";

// Query a document
const queryDocument = async (req, res, next) => {
  try {
    const { documentId, query, spaceId, model } = req.body;
    console.log(documentId);
    console.log(model);
    const userId = req.user.id;

    if (!documentId || !query) {
      return res
        .status(400)
        .json({ error: "Document ID and query are required" });
    }

    // Save the user's question to chat history if spaceId is provided
    if (spaceId) {
      await ChatMessage.create({
        spaceId,
        userId,
        type: "question",
        content: query,
      });
    }

    // Get the vector store for the document
    const { vectorStore, document } = await queryPinecone(documentId, query);

    // Initialize Groq client
    const groq = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: model, // Or any other model offered by Groq
    });

    // Create a retrieval chain
    const chain = RetrievalQAChain.fromLLM(groq, vectorStore.asRetriever());

    // Execute the query
    const response = await chain.call({
      query: query,
    });

    // Save the AI's answer to chat history if spaceId is provided
    if (spaceId) {
      await ChatMessage.create({
        spaceId,
        userId, // Using the same userId to track who initiated the conversation
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
