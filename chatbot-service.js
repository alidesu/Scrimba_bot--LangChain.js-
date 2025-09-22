// Chatbot Service module for Scrimba AI Chatbot
import { prompts, createLLM } from "./config.js";
import { initializeVectorStore, searchDocuments } from "./embeddings.js";

// Initialize AI model and chains
const llm = createLLM();
const standaloneQuestionChain = prompts.standaloneQuestion.pipe(llm);
const contextChain = prompts.contextAware.pipe(llm);

/**
 * Response structure for chatbot answers
 * @typedef {Object} ChatbotResponse
 * @property {string} answer - The AI's response
 * @property {number} sources - Number of documents used as sources
 * @property {string} standaloneQuestion - The processed standalone question
 * @property {string} [error] - Error message if something went wrong
 */

/**
 * Convert a conversational question to a standalone question
 * @param {string} question - The original question
 * @returns {Promise<string>} Standalone version of the question
 */
async function convertToStandaloneQuestion(question) {
  try {
    const response = await standaloneQuestionChain.invoke({ question });
    return response.content;
  } catch (error) {
    console.warn(
      "⚠️ Failed to convert to standalone question, using original:",
      error.message
    );
    return question;
  }
}

/**
 * Generate a context-aware response using retrieved documents
 * @param {string} context - Combined context from retrieved documents
 * @param {string} question - The user's question
 * @returns {Promise<string>} AI-generated response
 */
async function generateContextualResponse(context, question) {
  const response = await contextChain.invoke({ context, question });
  return response.content;
}

/**
 * Create a fallback response when no relevant documents are found
 * @param {string} standaloneQuestion - The processed question
 * @returns {ChatbotResponse} Fallback response object
 */
function createFallbackResponse(standaloneQuestion) {
  return {
    answer:
      "I couldn't find relevant information to answer your question. Could you try rephrasing it or asking about Scrimba's features, courses, or technical requirements?",
    sources: 0,
    standaloneQuestion: standaloneQuestion,
  };
}

/**
 * Create an error response
 * @param {Error} error - The error that occurred
 * @param {string} standaloneQuestion - The processed question
 * @returns {ChatbotResponse} Error response object
 */
function createErrorResponse(error, standaloneQuestion = "") {
  console.error("❌ Chatbot Error:", error.message);
  return {
    answer:
      "Sorry, I encountered an error processing your question. Please try again.",
    sources: 0,
    standaloneQuestion: standaloneQuestion,
    error: error.message,
  };
}

/**
 * Main function to process a question and generate an AI response
 * @param {string} question - The user's question
 * @returns {Promise<ChatbotResponse>} Complete response object
 */
export async function askQuestion(question) {
  if (!question || typeof question !== "string" || question.trim() === "") {
    return createErrorResponse(new Error("Invalid question provided"));
  }

  try {
    // Ensure vector store is ready
    await initializeVectorStore();

    // Convert to standalone question for better retrieval
    const standaloneQuestion = await convertToStandaloneQuestion(question);
    console.log(`🔄 Standalone question: ${standaloneQuestion}`);

    // Retrieve relevant documents
    const retrievedDocs = await searchDocuments(standaloneQuestion);
    console.log(`📚 Found ${retrievedDocs.length} relevant documents`);

    if (retrievedDocs && retrievedDocs.length > 0) {
      // Combine retrieved documents into context
      const context = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");

      // Generate AI response using context
      const answer = await generateContextualResponse(context, question);

      return {
        answer: answer,
        sources: retrievedDocs.length,
        standaloneQuestion: standaloneQuestion,
      };
    } else {
      return createFallbackResponse(standaloneQuestion);
    }
  } catch (error) {
    return createErrorResponse(error, question);
  }
}

/**
 * Process multiple questions in batch
 * @param {string[]} questions - Array of questions to process
 * @returns {Promise<ChatbotResponse[]>} Array of responses
 */
export async function askMultipleQuestions(questions) {
  if (!Array.isArray(questions)) {
    throw new Error("Questions must be provided as an array");
  }

  const responses = [];
  for (const question of questions) {
    console.log(`\n❓ Processing: ${question}`);
    const response = await askQuestion(question);
    responses.push(response);
    console.log(`✅ Response generated (${response.sources} sources)`);
  }

  return responses;
}

/**
 * Get chatbot service status and statistics
 * @returns {Object} Service status information
 */
export function getChatbotStatus() {
  return {
    modelName: llm.modelName || "Unknown",
    chainsInitialized: !!(standaloneQuestionChain && contextChain),
    timestamp: new Date().toISOString(),
  };
}

export default {
  askQuestion,
  askMultipleQuestions,
  getChatbotStatus,
};
