import { useMemo } from "react";
import type { Transaction, Category } from "../types";

export function useExpenseStats(transactions: Transaction[]) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const stats = useMemo(() => {
    const currentMonthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const lastMonthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    // Bar Chart: Monthly spending by category
    const categorySpending: Record<string, number> = {};
    currentMonthTx.forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + t.amount;
    });
    const barChartData = Object.entries(categorySpending).map(
      ([name, value]) => ({ name, value })
    );

    // Trend Line: Last 30 days
    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().split("T")[0];
      const amount = transactions
        .filter((t) => t.date.startsWith(dateStr))
        .reduce((sum, t) => sum + t.amount, 0);
      return { date: dateStr, amount };
    });

    // Top 3 categories comparison
    const lastMonthCategorySpending: Record<string, number> = {};
    lastMonthTx.forEach((t) => {
      lastMonthCategorySpending[t.category] =
        (lastMonthCategorySpending[t.category] || 0) + t.amount;
    });

    const comparison = Object.entries(categorySpending)
      .map(([name, currentAmount]) => {
        const lastAmount = lastMonthCategorySpending[name] || 0;
        const change =
          lastAmount === 0
            ? 100
            : ((currentAmount - lastAmount) / lastAmount) * 100;
        return { name, currentAmount, lastAmount, change };
      })
      .sort((a, b) => b.currentAmount - a.currentAmount)
      .slice(0, 3);

    // Insight Alert
    let insight = "No significant changes this month.";
    if (comparison.length > 0) {
      const top = comparison[0];
      if (Math.abs(top.change) > 20) {
        insight = `${top.name} is ${top.change > 0 ? "up" : "down"} ${Math.abs(
          top.change
        ).toFixed(0)}% vs last month.`;
      }
    }

    const totalSpentThisMonth = currentMonthTx.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    return {
      barChartData,
      trendData: last30Days,
      comparison,
      insight,
      totalSpentThisMonth,
    };
  }, [transactions, thisMonth, thisYear, lastMonth, lastMonthYear]);

  return stats;
}
