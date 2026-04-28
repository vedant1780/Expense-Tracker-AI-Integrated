import Expense from "../models/expense.model.js";
import { analyzeExpenses } from "../services/analysisService.js";
import { predictMonthlySpend } from "../services/predictionService.js";
import { generateInsights } from "../services/decisionEngine.js";

// TEMP user


export const getInsights = async (req, res) => {
  const USER_ID = req.user.id;
  try {
    const expenses = await Expense.find({ userId: USER_ID });

    const analysis = analyzeExpenses(expenses);
    const prediction = predictMonthlySpend(expenses);

    const insights = generateInsights(
      analysis,
      prediction,
      50000,
      10000
    );

    // ✅ NEW: Month-wise breakdown
    const monthlyMap = {};

    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const month = date.toLocaleString("default", { month: "short" });

      if (!monthlyMap[month]) {
        monthlyMap[month] = 0;
      }

      monthlyMap[month] += exp.amount;
    });

    const labels = Object.keys(monthlyMap);
    const spent = Object.values(monthlyMap);

    // ✅ Simple projection: scale current spend
    const today = new Date();
    const daysPassed = today.getDate();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const predicted = spent.map((val) =>
      Math.round((val / daysPassed) * totalDays)
    );

    res.json({
      analysis,
      prediction,
      insights,
      monthly: {
        labels,
        spent,
        predicted,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};