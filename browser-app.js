// Browser-compatible entry point for Scrimba AI Chatbot
// This file handles browser-specific initialization and provides fallbacks

// Mock environment variables for browser (you'll need to set these)
window.ENV = {
  OPENAI_API_KEY: "your-openai-api-key-here", // Replace with your actual key
  OPENROUTER_BASEURL: "https://openrouter.ai/api/v1",
};

// Simplified browser-compatible askQuestion function
async function askQuestion(question) {
  try {
    // Simple demo response - replace with actual API call
    console.log("Question received:", question);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response for testing
    const mockResponses = {
      "technical requirements":
        "Scrimba is designed to be ultra lightweight, so it can run on low-spec PCs and even with mobile internet speeds. No specific high-end hardware or ultra-fast connections are required.",
      "get started":
        "Start by enrolling in Scrimba's course and beginning with Module 1 (10 lessons, about 25 minutes total). This module will introduce you to your teachers, explain how Scrimba works, and guide you through building your first web app.",
      "programming languages":
        "HTML, CSS, and JavaScript (with progression to the React framework in the Frontend Developer Career Path). The AI Engineering Path focuses on implementing AI solutions.",
      default:
        "I'm a Scrimba AI assistant! I can help you with questions about Scrimba's courses, technical requirements, getting started, and more. Try asking about technical requirements, how to get started, or what programming languages you can learn.",
    };

    // Find matching response
    const questionLower = question.toLowerCase();
    let response = mockResponses.default;

    for (const [key, value] of Object.entries(mockResponses)) {
      if (questionLower.includes(key)) {
        response = value;
        break;
      }
    }

    return {
      answer: response,
      sources: Math.floor(Math.random() * 5) + 1,
      standaloneQuestion: question,
    };
  } catch (error) {
    console.error("Error in askQuestion:", error);
    return {
      answer: "Sorry, I encountered an error processing your question.",
      sources: 0,
      error: error.message,
    };
  }
}

// DOM element selectors
const selectors = {
  userInput: "#user-input",
  chatContainer: "#chatbot-conversation-container",
  form: "form",
};

// Message creation function
function createMessageElement(content, type = "ai") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("speech");

  switch (type) {
    case "human":
      messageElement.classList.add("speech-human");
      messageElement.textContent = content;
      break;
    case "ai":
      messageElement.classList.add("speech-ai");
      messageElement.innerHTML = content;
      break;
    case "error":
      messageElement.classList.add("speech-ai");
      messageElement.textContent = content;
      break;
  }

  return messageElement;
}

// Add message to chat
function addMessageToChat(messageElement) {
  const chatContainer = document.querySelector(selectors.chatContainer);
  if (!chatContainer) {
    console.error("Chat container not found");
    return;
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show loading message
function showLoadingMessage() {
  const loadingElement = createMessageElement("🤔 Thinking...", "ai");
  loadingElement.classList.add("loading-message");
  addMessageToChat(loadingElement);
  return loadingElement;
}

// Remove message
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

// Get user input and clear
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

// Format AI response
function formatAIResponse(response) {
  const { answer, sources } = response;
  return `${answer}<br><small>📚 Sources: ${sources}</small>`;
}

// Main conversation handler
async function progressConversation(event) {
  if (event) {
    event.preventDefault();
  }

  const question = getUserInputAndClear();
  if (!question) {
    return;
  }

  console.log("Processing question:", question);

  // Add user message to chat
  const userMessage = createMessageElement(question, "human");
  addMessageToChat(userMessage);

  // Show loading indicator
  const loadingMessage = showLoadingMessage();

  try {
    // Get AI response
    const response = await askQuestion(question);
    console.log("Got response:", response);

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

// Initialize when DOM is ready
function initializeBrowser() {
  console.log("🌐 Initializing browser interface...");

  // Handle form submission
  const form = document.querySelector(selectors.form);
  if (form) {
    form.addEventListener("submit", progressConversation);
    console.log("✅ Form event listener added");
  } else {
    console.error("❌ Form element not found");
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
    console.log("✅ Input event listener added");
  } else {
    console.error("❌ User input element not found");
  }

  // Add welcome message
  const welcomeMessage = createMessageElement(
    "Welcome to Scrimba AI! Ask me anything about Scrimba courses, technical requirements, or how to get started.",
    "ai"
  );
  addMessageToChat(welcomeMessage);

  // Focus on input
  if (userInput) {
    userInput.focus();
  }

  console.log("✅ Browser interface initialized successfully!");
}

// Wait for DOM to be ready, then initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBrowser);
} else {
  initializeBrowser();
}

// Make functions available globally for debugging
window.askQuestion = askQuestion;
window.progressConversation = progressConversation;
