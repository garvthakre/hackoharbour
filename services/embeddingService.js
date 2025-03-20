// services/embeddingService.js
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

// Initialize HuggingFace embeddings model
const createEmbeddingsService = () => {
  return new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2", // A good general purpose embedding model
    maxRetries: 5, // Add retries for stability
  });
};

export default createEmbeddingsService;