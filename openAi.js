import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const response = openai.responses.create({
  model: "gpt-5-nano",
  input: "write a haiku about ai",
  store: true,
});

response.then((result) => console.log(result.output_text));