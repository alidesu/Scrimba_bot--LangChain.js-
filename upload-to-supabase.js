import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

/**
 * Upload Scrimba documents to Supabase Vector Store
 * This script creates embeddings and stores them in Supabase for later retrieval
 */
async function uploadToSupabase() {
  try {
    console.log("📚 Starting Supabase upload process...");

    // Read the Scrimba info file
    const text = await readFile("scrimba-info.txt", "utf8");

    // Split the text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""],
    });

    const documents = await splitter.createDocuments([text]);
    console.log(`📄 Split text into ${documents.length} documents`);

    // Setup Supabase client
    const sbApiKey = process.env.SUPABASE_API_KEY;
    const sbUrl = process.env.SUPABASE_URL;
    const openAIApiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENROUTER_BASEURL;

    if (!sbApiKey || !sbUrl || !openAIApiKey) {
      throw new Error(
        "Missing required environment variables. Check your .env file."
      );
    }

    const client = createClient(sbUrl, sbApiKey);

    // Create OpenAI embeddings (1536 dimensions - compatible with Supabase)
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIApiKey,
      configuration: {
        baseURL: baseURL,
      },
    });

    console.log("🚀 Creating embeddings and uploading to Supabase...");

    // Upload documents to Supabase Vector Store
    await SupabaseVectorStore.fromDocuments(documents, embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    console.log(
      "✅ Successfully uploaded",
      documents.length,
      "document embeddings to Supabase!"
    );
    console.log("🎯 Your vector store is now ready for retrieval!");
  } catch (error) {
    console.error("❌ Error uploading to Supabase:", error.message);

    if (error.message.includes("quota")) {
      console.log(
        "💡 Tip: You may have hit OpenAI API quota limits. Consider:"
      );
      console.log("   - Adding billing to your OpenAI account");
      console.log("   - Using the free HuggingFace embeddings instead");
    }

    if (error.message.includes("dimensions")) {
      console.log(
        "💡 Tip: Dimension mismatch. Make sure your Supabase table is configured for 1536 dimensions"
      );
    }
  }
}

// Run the upload if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadToSupabase();
}

export { uploadToSupabase };
