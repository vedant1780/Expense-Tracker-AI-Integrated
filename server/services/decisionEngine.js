export const generateInsights = (analysis, prediction, income = 0, savingsGoal = 0) => {
  let riskLevel = "LOW";
  let suggestions = [];

  // 🔴 Overspending check
  if (income && prediction > income) {
    riskLevel = "HIGH";
    suggestions.push("You are projected to exceed your monthly income.");
  }

  // 🍔 Category check
  const foodSpend = analysis.categoryBreakdown["Food"] || 0;

  if (income && foodSpend > income * 0.4) {
    riskLevel = "MEDIUM";
    suggestions.push("Food expenses are too high. Reduce dining out.");
  }

  // 💰 Savings check
  if (income && savingsGoal && (income - prediction < savingsGoal)) {
    suggestions.push("You may not meet your savings goal this month.");
  }

  // 📉 General advice
  if (prediction < income * 0.6) {
    suggestions.push("Good spending habits. You are under control.");
  }

  return {
    riskLevel,
    suggestions
  };
};