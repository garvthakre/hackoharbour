// src/services/llmService.js
import { ChatGroq } from "@langchain/groq";
import { DEFAULT_MODEL } from "../config/llmModels.js";
import dotenv from "dotenv";

dotenv.config();

class LLMService {
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: DEFAULT_MODEL,
      temperature: 0.5,
    });
  }

  /**
   * Get a configured LLM instance
   * @param {Object} config - Optional configuration overrides (modelName, temperature, etc.)
   * @returns {ChatGroq} Configured ChatGroq instance
   */
  getInstance(config = {}) {
    if (Object.keys(config).length === 0) {
      return this.model;
    }
    
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: config.modelName || DEFAULT_MODEL,
      temperature: config.temperature || 0.5,
      ...config
    });
  }

  /**
   * Generate text response (Simple wrapper if needed, but returning instance is usually better for LangChain)
   */
  async generate(prompt) {
    const response = await this.model.invoke(prompt);
    return response.content;
  }
}

export const llmService = new LLMService();
