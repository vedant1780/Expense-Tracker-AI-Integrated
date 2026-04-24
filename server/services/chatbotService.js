import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (message, context) => {
  try {
    // 1. Remove "models/" prefix and add "-latest"
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

   const prompt = `
You are a professional financial assistant AI. 

Format your response using Markdown:
1. Use ## for the main title.
2. Use Bold text for all dollar amounts (e.g., **$500**).
3. Use a Table to show the category breakdown.
4. Use a Blockquote (>) for the warning to make it stand out.
5. Use an Emojis to represent categories.

User Context:
${JSON.stringify(context)}

User Query:
${message}
`;

    const result = await model.generateContent(prompt);
    
    // 2. Await the response and call .text() safely
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (err) {
    // Detailed logging to help you see if it's still a 404 or something else (like an API key issue)
    console.error("Gemini Error Details:", err.message);
    return "AI service temporarily unavailable";
  }
};