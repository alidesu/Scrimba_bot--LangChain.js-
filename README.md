# Scrimba AI Chatbot

A modular, full-stack AI chatbot for Scrimba knowledge retrieval, built with LangChain.js, Node.js, and a browser-friendly interactive UI.

## Features

- **Retrieval-Augmented Generation (RAG):** Combines vector search and LLM for context-aware answers.
- **Modular Design:** Clean separation of config, embeddings, chatbot logic, browser UI, and API server.
- **Browser & Node.js Support:** Works as a web app and CLI/test tool.
- **Supabase Integration:** Easily upload embeddings to Supabase for scalable vector storage.
- **Customizable Knowledge Base:** Uses `scrimba-info.txt` for source content.
- **Express API Server:** Enables real AI responses in the browser via `/api/chat`.
- **Beautiful UI:** Responsive, animated chat interface with source attribution.

## Project Structure

```
├── api-server.js           # Express API server for browser-to-AI bridge
├── browser-app.js          # Simple browser-only chatbot logic
├── advanced-browser-app.js # Enhanced browser chatbot (topic matching, fallback)
├── complete-browser-app.js # Full browser/Node.js bridge (real AI via API)
├── browser-interface.js    # DOM and UI logic for chat
├── chatbot-service.js      # Main chatbot logic (LangChain, RAG)
├── config.js               # Centralized config and prompt templates
├── embeddings.js           # Vector store and embedding management
├── index.js                # Main entry point (Node.js/test)
├── index.html              # Chatbot web UI
├── index.css               # Styles for chatbot UI
├── scrimba-info.txt        # Knowledge base for embeddings
├── upload-to-supabase.js   # Utility to upload embeddings to Supabase
├── images/                 # Logo and UI assets
└── package.json            # Project dependencies
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Prepare Knowledge Base

- Edit `scrimba-info.txt` with your Scrimba documentation or FAQ.

### 3. Upload Embeddings to Supabase (optional)

```bash
node upload-to-supabase.js
```
- Configure your Supabase keys in `.env`.

### 4. Run the API Server

```bash
node api-server.js
```
- Starts Express server at `http://localhost:3001/api/chat`.

### 5. Start Local Web Server

```bash
python3 -m http.server 8000
```
- Or use any static server to serve `index.html`.

### 6. Open the Chatbot

- Visit `http://localhost:8000/index.html` in your browser.

## Usage

- **Ask questions** about Scrimba courses, technical requirements, community, etc.
- **Get AI-powered answers** with context and source attribution.
- **Works in browser and Node.js** (for testing and development).

## Customization

- **Knowledge Base:** Update `scrimba-info.txt`.
- **Model/Embedding:** Change settings in `config.js`.
- **UI:** Edit `index.css` and `index.html` for branding.

## API

- **POST `/api/chat`**
  - Request: `{ "question": "Your question here" }`
  - Response: `{ answer, sources, standaloneQuestion }`

## Troubleshooting

- If you see dependency errors, use:
  ```
  npm install --legacy-peer-deps
  ```
- Ensure your `.env` is set up for API keys and Supabase.

## License

MIT
