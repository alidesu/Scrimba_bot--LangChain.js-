// Configuration module for Scrimba AI Chatbot
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import "dotenv/config";

// Environment variables
export const config = {
  openAI: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENROUTER_BASEURL,
  },
  model: {
    name: "x-ai/grok-4-fast:free",
    temperature: 0,
  },
  embeddings: {
    modelName: "Xenova/all-MiniLM-L6-v2",
  },
  vectorStore: {
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""],
  },
  files: {
    dataSource: "scrimba-info.txt",
  },
};

// Prompt templates
export const prompts = {
  standaloneQuestion: PromptTemplate.fromTemplate(
    "Given a question, convert it to a standalone question. question: {question} standalone question:"
  ),

  contextAware: PromptTemplate.fromTemplate(`
    Based on the following context about Scrimba, answer the user's question:
    
    Context: {context}
    
    Question: {question}
    
    Answer:
  `),
};

// Initialize AI model
export function createLLM() {
  return new ChatOpenAI({
    openAIApiKey: config.openAI.apiKey,
    modelName: config.model.name,
    temperature: config.model.temperature,
    configuration: {
      baseURL: config.openAI.baseURL,
    },
  });
}

// Initialize embeddings
export function createEmbeddings() {
  return new HuggingFaceTransformersEmbeddings({
    modelName: config.embeddings.modelName,
  });
}

export default {
  config,
  prompts,
  createLLM,
  createEmbeddings,
};
