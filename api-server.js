// API Server Bridge for Browser-to-AI Communication
import express from "express";
import cors from "cors";
import { askQuestion } from "./chatbot-service.js";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Scrimba AI API is running" });
});

// Main chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Invalid question provided",
        answer: "Please provide a valid question.",
        sources: 0,
      });
    }

    console.log(`📥 API Request: "${question}"`);

    // Call the real AI service
    const response = await askQuestion(question);

    console.log(`📤 API Response: ${response.sources} sources found`);

    res.json(response);
  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({
      error: error.message,
      answer: "Sorry, I encountered an error processing your question.",
      sources: 0,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Scrimba AI API Server running on http://localhost:${PORT}`);
  console.log(
    `🌐 Browser can now access real AI at http://localhost:${PORT}/api/chat`
  );
});

export default app;
