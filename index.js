import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readFile, writeFile } from "fs/promises";

try {
  const text = await readFile("scrimba-info.txt", "utf8");

  const splitter = new RecursiveCharacterTextSplitter();

  const output = await splitter.createDocuments([text]);

  // Convert the output to a readable string format
  const outputString = JSON.stringify(output, null, 2);

  // Save to output.txt file
  await writeFile("output.txt", outputString, "utf8");

  console.log("Output saved to output.txt file successfully!");
  console.log(`Created ${output.length} document chunks`);
  
} catch (err) {
  console.log(err);
}
