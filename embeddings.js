// Embeddings and Vector Store module for Scrimba AI Chatbot
import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { config, createEmbeddings } from "./config.js";

// Singleton pattern for vector store
let vectorStore = null;
let retriever = null;
let embeddings = null;

/**
 * Initialize embeddings model
 * @returns {HuggingFaceTransformersEmbeddings} Embeddings instance
 */
export function getEmbeddings() {
  if (!embeddings) {
    embeddings = createEmbeddings();
  }
  return embeddings;
}

/**
 * Load and split text from the data source file
 * @returns {Promise<Array>} Array of document chunks
 */
async function loadAndSplitDocuments() {
  console.log(`📚 Loading data from ${config.files.dataSource}...`);

  const text = await readFile(config.files.dataSource, "utf8");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.vectorStore.chunkSize,
    chunkOverlap: config.vectorStore.chunkOverlap,
    separators: config.vectorStore.separators,
  });

  const documents = await splitter.createDocuments([text]);
  console.log(`📄 Split into ${documents.length} document chunks`);

  return documents;
}

/**
 * Initialize the vector store with document embeddings
 * @returns {Promise<void>}
 */
export async function initializeVectorStore() {
  if (vectorStore) {
    console.log("✅ Vector store already initialized");
    return;
  }

  try {
    console.log("🔧 Initializing vector store...");

    const documents = await loadAndSplitDocuments();
    const embeddingsModel = getEmbeddings();

    vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      embeddingsModel
    );
    retriever = vectorStore.asRetriever();

    console.log("✅ Vector store initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize vector store:", error.message);
    throw error;
  }
}

/**
 * Get the vector store retriever
 * @returns {VectorStoreRetriever} The retriever instance
 */
export function getRetriever() {
  if (!retriever) {
    throw new Error(
      "Vector store not initialized. Call initializeVectorStore() first."
    );
  }
  return retriever;
}

/**
 * Search for relevant documents based on a query
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of relevant documents
 */
export async function searchDocuments(query) {
  const retrieverInstance = getRetriever();
  return await retrieverInstance.invoke(query);
}

/**
 * Reset the vector store (useful for testing or reinitialization)
 */
export function resetVectorStore() {
  vectorStore = null;
  retriever = null;
  embeddings = null;
  console.log("🔄 Vector store reset");
}

/**
 * Get vector store statistics
 * @returns {Object} Statistics about the vector store
 */
export function getVectorStoreStats() {
  return {
    initialized: vectorStore !== null,
    hasRetriever: retriever !== null,
    embeddingsModel: embeddings ? config.embeddings.modelName : null,
  };
}

export default {
  initializeVectorStore,
  getRetriever,
  searchDocuments,
  resetVectorStore,
  getVectorStoreStats,
  getEmbeddings,
};
