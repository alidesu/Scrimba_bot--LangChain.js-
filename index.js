import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readFile, writeFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

try {
  const text = await readFile("scrimba-info.txt", "utf8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""],
  });

  const output = await splitter.createDocuments([text]);

  // Convert the output to a readable string format
  // const outputString = JSON.stringify(output, null, 2);

  const sbApiKey = process.env.SUPABASE_API_KEY;
  const sbUrl = process.env.SUPABASE_URL;
  const openAIApiKey = process.env.OPENAI_API_KEY;

  const client = createClient(sbUrl, sbApiKey);

  console.log(output);
} catch (err) {
  console.log(err);
}
