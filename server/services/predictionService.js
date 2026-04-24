export const predictMonthlySpend = (expenses) => {
  if (expenses.length === 0) return 0;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const days = new Set(
    expenses.map(e => new Date(e.date).toDateString())
  ).size || 1;

  const dailyAvg = total / days;

  return dailyAvg * 30;
};