// import { readFile } from "fs/promises";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { createClient } from "@supabase/supabase-js";
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
// import "dotenv/config";

// try {
//   const text = await readFile("scrimba-info.txt", "utf8");

//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 50,
//     separators: ["\n\n", "\n", " ", ""],
//   });

//   const output = await splitter.createDocuments([text]);

//   const sbApiKey = process.env.SUPABASE_API_KEY;
//   const sbUrl = process.env.SUPABASE_URL;

//   const client = createClient(sbUrl, sbApiKey);


//   const embeddings = new HuggingFaceTransformersEmbeddings({
//     modelName: "Xenova/all-MiniLM-L6-v2",
//   });

//   console.log("🚀 Creating embeddings and storing in Supabase...");

//   await SupabaseVectorStore.fromDocuments(output, embeddings, {
//     client,
//     tableName: "documents",
//   });

//   console.log(
//     "✅ Successfully created and stored",
//     output.length,
//     "document embeddings!"
//   );
// } catch (err) {
//   console.log("❌ Error:", err);
// }





// //AI Application Code


document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

const openAIApiKey = process.env.OPENAI_API_KEY

async function progressConversation() {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

    // add AI message
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    chatbotConversation.appendChild(newAiSpeechBubble)
    newAiSpeechBubble.textContent = result
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}