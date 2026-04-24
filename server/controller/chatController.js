import Expense from "../models/expense.model.js";
import { analyzeExpenses } from "../services/analysisService.js";
import { predictMonthlySpend } from "../services/predictionService.js";
import { generateInsights } from "../services/decisionEngine.js";
import { chatWithAI } from "../services/chatbotService.js";

const USER_ID = "661f1b2c9a1234567890abcd";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    const expenses = await Expense.find({ userId: USER_ID });

    const analysis = analyzeExpenses(expenses);
    const prediction = predictMonthlySpend(expenses);

    const insights = generateInsights(
      analysis,
      prediction,
      50000,
      10000
    );

    const context = {
      analysis,
      prediction,
      insights
    };

    const reply = await chatWithAI(message, context);

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};