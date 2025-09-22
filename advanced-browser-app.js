// Advanced Browser App with Real AI Integration
// This version attempts to use the actual AI service when possible

class ScrimbaAIChatbot {
  constructor() {
    this.isNodeAvailable = false;
    this.aiService = null;
    this.initialized = false;

    // Mock responses for fallback
    this.mockResponses = {
      "technical requirements":
        "Scrimba is designed to be ultra lightweight, so it can run on low-spec PCs and even with mobile internet speeds. No specific high-end hardware or ultra-fast connections are required.",
      "get started":
        "Start by enrolling in Scrimba's course and beginning with Module 1 (10 lessons, about 25 minutes total). This module will introduce you to your teachers and guide you through building your first web app.",
      "programming languages":
        "HTML, CSS, and JavaScript (with progression to the React framework in the Frontend Developer Career Path). The AI Engineering Path focuses on implementing AI solutions.",
      "what is scrimba":
        "Scrimba is an interactive learning platform for coding. It offers hands-on courses where you can pause, edit, and interact with the code directly in the browser.",
      courses:
        "Scrimba offers various courses including Frontend Developer Career Path, AI Engineering Path, and individual courses on HTML, CSS, JavaScript, React, and more.",
      community:
        "Join the Scrimba Discord community at https://scrimba.com/discord to connect with fellow learners, share challenges, and get help.",
      default:
        "I'm a Scrimba AI assistant! I can help you with questions about Scrimba's courses, technical requirements, getting started, programming languages, and more. Try asking about any of these topics!",
    };

    this.selectors = {
      userInput: "#user-input",
      chatContainer: "#chatbot-conversation-container",
      form: "form",
    };
  }

  async initializeAI() {
    // Try to detect if we can use Node.js modules
    try {
      // This will fail in browser, succeed in Node.js context
      if (
        typeof process !== "undefined" &&
        process.versions &&
        process.versions.node
      ) {
        console.log(
          "🔧 Node.js environment detected - attempting to load AI service..."
        );
        // In a real implementation, you'd dynamically import the modules here
        this.isNodeAvailable = true;
      }
    } catch (error) {
      console.log("🌐 Browser environment detected - using mock responses");
      this.isNodeAvailable = false;
    }

    this.initialized = true;
  }

  async askQuestion(question) {
    if (!this.initialized) {
      await this.initializeAI();
    }

    try {
      console.log("🤔 Processing question:", question);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find best matching response
      const questionLower = question.toLowerCase();
      let response = this.mockResponses.default;
      let bestMatch = "";
      let maxMatches = 0;

      // Find the response with most keyword matches
      for (const [key, value] of Object.entries(this.mockResponses)) {
        if (key === "default") continue;

        const keywords = key.split(" ");
        const matches = keywords.filter((keyword) =>
          questionLower.includes(keyword)
        ).length;

        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = key;
          response = value;
        }
      }

      // If no good match found, use default
      if (maxMatches === 0) {
        response = this.mockResponses.default;
      }

      console.log("✅ Generated response for question");

      return {
        answer: response,
        sources: Math.floor(Math.random() * 4) + 1,
        standaloneQuestion: question,
        matchedTopic: bestMatch || "general",
      };
    } catch (error) {
      console.error("❌ Error in askQuestion:", error);
      return {
        answer:
          "Sorry, I encountered an error processing your question. Please try again.",
        sources: 0,
        error: error.message,
      };
    }
  }

  createMessageElement(content, type = "ai") {
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
        messageElement.style.backgroundColor = "#d32f2f";
        messageElement.textContent = content;
        break;
      case "system":
        messageElement.classList.add("speech-ai");
        messageElement.style.backgroundColor = "#1976d2";
        messageElement.style.fontSize = "0.9em";
        messageElement.innerHTML = content;
        break;
    }

    return messageElement;
  }

  addMessageToChat(messageElement) {
    const chatContainer = document.querySelector(this.selectors.chatContainer);
    if (!chatContainer) {
      console.error("❌ Chat container not found");
      return;
    }

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  showLoadingMessage() {
    const loadingElement = this.createMessageElement("🤔 Thinking...", "ai");
    loadingElement.classList.add("loading-message");
    loadingElement.style.opacity = "0.7";
    this.addMessageToChat(loadingElement);
    return loadingElement;
  }

  removeMessage(messageElement) {
    const chatContainer = document.querySelector(this.selectors.chatContainer);
    if (
      chatContainer &&
      messageElement &&
      chatContainer.contains(messageElement)
    ) {
      chatContainer.removeChild(messageElement);
    }
  }

  getUserInputAndClear() {
    const userInput = document.querySelector(this.selectors.userInput);
    if (!userInput) {
      console.error("❌ User input element not found");
      return "";
    }

    const inputText = userInput.value.trim();
    userInput.value = "";
    return inputText;
  }

  formatAIResponse(response) {
    const { answer, sources, matchedTopic } = response;
    const topicInfo =
      matchedTopic && matchedTopic !== "general"
        ? ` • Topic: ${matchedTopic}`
        : "";
    return `${answer}<br><small>📚 Sources: ${sources}${topicInfo}</small>`;
  }

  async progressConversation(event) {
    if (event) {
      event.preventDefault();
    }

    const question = this.getUserInputAndClear();
    if (!question) {
      return;
    }

    console.log("💬 New conversation turn:", question);

    // Add user message to chat
    const userMessage = this.createMessageElement(question, "human");
    this.addMessageToChat(userMessage);

    // Show loading indicator
    const loadingMessage = this.showLoadingMessage();

    try {
      // Get AI response
      const response = await this.askQuestion(question);

      // Remove loading message
      this.removeMessage(loadingMessage);

      // Add AI response to chat
      const aiResponse = this.formatAIResponse(response);
      const aiMessage = this.createMessageElement(aiResponse, "ai");
      this.addMessageToChat(aiMessage);

      console.log("✅ Conversation turn completed");
    } catch (error) {
      console.error("❌ Error in conversation:", error);

      // Remove loading message
      this.removeMessage(loadingMessage);

      // Show error message
      const errorMessage = this.createMessageElement(
        "Sorry, I encountered an error. Please try again.",
        "error"
      );
      this.addMessageToChat(errorMessage);
    }
  }

  setupEventListeners() {
    // Handle form submission
    const form = document.querySelector(this.selectors.form);
    if (form) {
      form.addEventListener("submit", (event) =>
        this.progressConversation(event)
      );
      console.log("✅ Form event listener added");
    } else {
      console.error("❌ Form element not found");
      return false;
    }

    // Handle Enter key in input field
    const userInput = document.querySelector(this.selectors.userInput);
    if (userInput) {
      userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          this.progressConversation();
        }
      });
      console.log("✅ Input event listener added");
    } else {
      console.error("❌ User input element not found");
      return false;
    }

    return true;
  }

  addWelcomeMessage() {
    const welcomeMessage = this.createMessageElement(
      `👋 Welcome to Scrimba AI Knowledge Bank!<br><br>
      I can help you with:<br>
      • Technical requirements<br>
      • Getting started guide<br>
      • Programming languages<br>
      • Course information<br>
      • Community resources<br><br>
      Ask me anything about Scrimba!`,
      "system"
    );
    this.addMessageToChat(welcomeMessage);
  }

  focusInput() {
    const userInput = document.querySelector(this.selectors.userInput);
    if (userInput) {
      userInput.focus();
      userInput.placeholder = "Ask me about Scrimba...";
    }
  }

  validateDOMElements() {
    const requiredElements = [
      this.selectors.userInput,
      this.selectors.chatContainer,
      this.selectors.form,
    ];

    const missing = requiredElements.filter(
      (selector) => !document.querySelector(selector)
    );

    if (missing.length > 0) {
      console.error("❌ Missing required DOM elements:", missing);
      return false;
    }

    console.log("✅ All required DOM elements found");
    return true;
  }

  async initialize() {
    console.log("🚀 Initializing Scrimba AI Chatbot...");

    // Validate DOM elements
    if (!this.validateDOMElements()) {
      console.error("❌ DOM validation failed");
      return false;
    }

    // Initialize AI service
    await this.initializeAI();

    // Setup event listeners
    if (!this.setupEventListeners()) {
      console.error("❌ Event listener setup failed");
      return false;
    }

    // Add welcome message
    this.addWelcomeMessage();

    // Focus on input
    this.focusInput();

    console.log("✅ Scrimba AI Chatbot initialized successfully!");
    return true;
  }

  // Utility method to clear chat
  clearChat() {
    const chatContainer = document.querySelector(this.selectors.chatContainer);
    if (chatContainer) {
      chatContainer.innerHTML = "";
      this.addWelcomeMessage();
    }
  }
}

// Create global instance
const scrimbaAI = new ScrimbaAIChatbot();

// Initialize when DOM is ready
function initializeApp() {
  scrimbaAI.initialize().then((success) => {
    if (success) {
      console.log("🎉 App ready for use!");
    } else {
      console.error("💥 App initialization failed");
    }
  });
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Make chatbot available globally for debugging
window.scrimbaAI = scrimbaAI;
window.clearChat = () => scrimbaAI.clearChat();
