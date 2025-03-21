// services/embeddingService.js
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import dotenv from 'dotenv';

dotenv.config();

// Initialize HuggingFace embeddings model
const createEmbeddingsService = () => {
  console.log("HF key: ", process.env.HF_API_KEY)
  if(!process.env.HF_API_KEY) {
    throw new Error("Hugging Face API key is required");
  }
  return new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2", // A good general purpose embedding model
    maxRetries: 5, // Add retries for stability
  });
};

export default createEmbeddingsService;