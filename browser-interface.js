// Browser Interface module for Scrimba AI Chatbot
import { askQuestion } from "./chatbot-service.js";

/**
 * DOM element selectors used by the interface
 */
const selectors = {
  userInput: "#user-input",
  chatContainer: "#chatbot-conversation-container",
  form: "form",
};

/**
 * CSS classes for different message types
 */
const messageClasses = {
  speech: "speech",
  human: "speech-human",
  ai: "speech-ai",
  error: "speech-error",
};

/**
 * Create a message element for the chat interface
 * @param {string} content - The message content
 * @param {string} type - Message type ('human', 'ai', 'error')
 * @returns {HTMLElement} The created message element
 */
function createMessageElement(content, type = "ai") {
  const messageElement = document.createElement("div");
  messageElement.classList.add(messageClasses.speech);

  switch (type) {
    case "human":
      messageElement.classList.add(messageClasses.human);
      messageElement.textContent = content;
      break;
    case "ai":
      messageElement.classList.add(messageClasses.ai);
      messageElement.innerHTML = content; // Allow HTML for formatted responses
      break;
    case "error":
      messageElement.classList.add(messageClasses.ai, messageClasses.error);
      messageElement.textContent = content;
      break;
    default:
      messageElement.classList.add(messageClasses.ai);
      messageElement.textContent = content;
  }

  return messageElement;
}

/**
 * Add a message to the chat container and scroll to bottom
 * @param {HTMLElement} messageElement - The message element to add
 */
function addMessageToChat(messageElement) {
  const chatContainer = document.querySelector(selectors.chatContainer);
  if (!chatContainer) {
    console.error("Chat container not found");
    return;
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Show a loading indicator in the chat
 * @returns {HTMLElement} The loading message element
 */
function showLoadingMessage() {
  const loadingElement = createMessageElement("🤔 Thinking...", "ai");
  loadingElement.classList.add("loading-message");
  addMessageToChat(loadingElement);
  return loadingElement;
}

/**
 * Remove a specific message element from the chat
 * @param {HTMLElement} messageElement - The element to remove
 */
function removeMessage(messageElement) {
  const chatContainer = document.querySelector(selectors.chatContainer);
  if (
    chatContainer &&
    messageElement &&
    chatContainer.contains(messageElement)
  ) {
    chatContainer.removeChild(messageElement);
  }
}

/**
 * Get the current user input and clear the input field
 * @returns {string} The user's input text
 */
function getUserInputAndClear() {
  const userInput = document.querySelector(selectors.userInput);
  if (!userInput) {
    console.error("User input element not found");
    return "";
  }

  const inputText = userInput.value.trim();
  userInput.value = "";
  return inputText;
}

/**
 * Format an AI response with sources information
 * @param {Object} response - The chatbot response object
 * @returns {string} Formatted HTML string
 */
function formatAIResponse(response) {
  const { answer, sources } = response;
  return `${answer}<br><small>📚 Sources: ${sources}</small>`;
}

/**
 * Handle the conversation flow when user submits a question
 * @param {Event} event - The form submit event
 */
export async function progressConversation(event) {
  if (event) {
    event.preventDefault();
  }

  const question = getUserInputAndClear();
  if (!question) {
    return;
  }

  // Add user message to chat
  const userMessage = createMessageElement(question, "human");
  addMessageToChat(userMessage);

  // Show loading indicator
  const loadingMessage = showLoadingMessage();

  try {
    // Get AI response
    const response = await askQuestion(question);

    // Remove loading message
    removeMessage(loadingMessage);

    // Add AI response to chat
    const aiResponse = formatAIResponse(response);
    const aiMessage = createMessageElement(aiResponse, "ai");
    addMessageToChat(aiMessage);
  } catch (error) {
    console.error("Error in conversation:", error);

    // Remove loading message
    removeMessage(loadingMessage);

    // Show error message
    const errorMessage = createMessageElement(
      "Sorry, I encountered an error. Please try again.",
      "error"
    );
    addMessageToChat(errorMessage);
  }
}

/**
 * Initialize the browser interface with event listeners
 */
export function initializeBrowserInterface() {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupEventListeners);
  } else {
    setupEventListeners();
  }
}

/**
 * Set up all necessary event listeners
 */
function setupEventListeners() {
  // Handle form submission
  const form = document.querySelector(selectors.form);
  if (form) {
    form.addEventListener("submit", progressConversation);
  } else {
    console.warn(
      "Form element not found - manual event binding may be required"
    );
  }

  // Handle Enter key in input field
  const userInput = document.querySelector(selectors.userInput);
  if (userInput) {
    userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        progressConversation();
      }
    });
  }

  console.log("✅ Browser interface initialized");
}

/**
 * Clear the chat conversation
 */
export function clearChat() {
  const chatContainer = document.querySelector(selectors.chatContainer);
  if (chatContainer) {
    chatContainer.innerHTML = "";
  }
}

/**
 * Check if all required DOM elements are present
 * @returns {boolean} True if all elements are found
 */
export function validateDOMElements() {
  const requiredElements = [selectors.userInput, selectors.chatContainer];

  const missing = requiredElements.filter(
    (selector) => !document.querySelector(selector)
  );

  if (missing.length > 0) {
    console.error("Missing required DOM elements:", missing);
    return false;
  }

  return true;
}

/**
 * Set focus on the user input field
 */
export function focusInput() {
  const userInput = document.querySelector(selectors.userInput);
  if (userInput) {
    userInput.focus();
  }
}

export default {
  initializeBrowserInterface,
  progressConversation,
  clearChat,
  validateDOMElements,
  focusInput,
};
