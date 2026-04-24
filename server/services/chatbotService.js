import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const chatWithAI = async (message, context) => {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are a financial assistant AI.

Rules:
- Use user financial data to give advice
- Be short, practical, and decision-focused
- Suggest savings improvements
- Warn about overspending
- Always explain reasoning

User Context:
${JSON.stringify(context)}
        `
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  return response.choices[0].message.content;
};