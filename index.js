// Scrimba AI Chatbot - Main Application Entry Point
import {
  askQuestion,
  askMultipleQuestions,
  getChatbotStatus,
} from "./chatbot-service.js";
import { initializeVectorStore, getVectorStoreStats } from "./embeddings.js";
import { initializeBrowserInterface } from "./browser-interface.js";

/**
 * Example usage function for testing the chatbot
 */
async function testChatbot() {
  console.log("� Starting Scrimba AI Chatbot Test...\n");

  // Display system status
  console.log("📊 System Status:");
  console.log("Chatbot:", getChatbotStatus());
  console.log("Vector Store:", getVectorStoreStats());
  console.log();

  const questions = [
    "What are the technical requirements for running Scrimba?",
    "How do I get started with Scrimba?",
    "What programming languages can I learn on Scrimba?",
  ];

  try {
    const responses = await askMultipleQuestions(questions);

    responses.forEach((response, index) => {
      console.log(`❓ Question: ${questions[index]}`);
      console.log(`🤖 Answer: ${response.answer}`);
      console.log(`📊 Sources: ${response.sources}`);
      console.log("─".repeat(50));
    });

    console.log("✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

/**
 * Initialize the application for browser use
 */
function initializeBrowser() {
  console.log("🌐 Initializing browser interface...");
  initializeBrowserInterface();
}

/**
 * Main application entry point
 */
async function main() {
  try {
    // Initialize vector store
    await initializeVectorStore();

    // Check if running in browser or Node.js
    if (typeof window !== "undefined") {
      // Browser environment
      initializeBrowser();
    } else {
      // Node.js environment - run test
      await testChatbot();
    }
  } catch (error) {
    console.error("❌ Application initialization failed:", error.message);
  }
}

// Run the application
main();

// Export main functions for external use
export { askQuestion, initializeVectorStore, initializeBrowser };
