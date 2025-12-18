// src/config/llmModels.js

export const LLM_MODELS = {
  GROQ: {
    MIXTRAL: "mixtral-8x7b-32768",
    LLAMA3_70: "llama3-70b-8192",
    LLAMA3_8: "llama3-8b-8192",
    GEMMA_7: "gemma-7b-it",
  },
  // Placeholders for other providers if needed
  OPENAI: {
    GPT4: "gpt-4-turbo",
    GPT35: "gpt-3.5-turbo",
  }
};

export const DEFAULT_MODEL = LLM_MODELS.GROQ.LLAMA3_70;
