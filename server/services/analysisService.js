export const analyzeExpenses = (expenses) => {
  let totalSpent = 0;
  const categoryMap = {};

  for (let exp of expenses) {
    const amount = exp.amount || 0;
    const category = exp.category || "Uncategorized";

    totalSpent += amount;

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category] += amount;
  }

  // convert object → array (better for frontend charts)
  const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    totalSpent: categoryMap[cat]
  }));

  return {
    totalSpent,
    categoryBreakdown
  };
};