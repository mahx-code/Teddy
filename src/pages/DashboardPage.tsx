import { Sidebar, TopNav } from "../components/Navigation";
import { MetricCard, InsightBanner } from "../components/Metrics";
import { TransactionForm } from "../components/TransactionForm";
import { SpendingBarChart, TrendLineChart } from "../components/Charts";
import { ComparisonSection } from "../components/ComparisonSection";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useExpenseStats } from "../hooks/useExpenseStats";
import { useTheme } from "../context/ThemeContext";
import {
  DollarSign,
  Download,
  PieChart,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export function DashboardPage() {
  const { transactions, addTransaction, isLoading, error } = usePuterStorage();
  const { barChartData, trendData, comparison, insight, totalSpentThisMonth } =
    useExpenseStats(transactions);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const exportCSV = () => {
    const headers = ["Date", "Category", "Amount", "Description"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.category,
      t.amount.toString(),
      t.description || "",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex ${
          isDark ? "bg-zinc-950" : "bg-slate-50"
        }`}
      >
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className={isDark ? "text-zinc-500" : "text-slate-500"}>
              Loading your transactions...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative pb-20">
        <TopNav />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                Dashboard
              </h1>
              <p
                className={`mt-1 ${
                  isDark ? "text-zinc-500" : "text-slate-500"
                }`}
              >
                Here's your spending overview.
              </p>
            </div>
            <button
              onClick={exportCSV}
              disabled={transactions.length === 0}
              className={`px-5 py-2.5 font-bold rounded-xl flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                isDark
                  ? "bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              label="Monthly Spending"
              value={`$${totalSpentThisMonth.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
              subtext={`Total spent in ${new Date().toLocaleDateString(
                undefined,
                { month: "long", year: "numeric" }
              )}`}
              icon={DollarSign}
              className="lg:col-span-1"
            />
            <div className="lg:col-span-2">
              <InsightBanner insight={insight} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <SpendingBarChart data={barChartData} />
              <TrendLineChart data={trendData} />
            </div>
            <div className="xl:col-span-1">
              <ComparisonSection data={comparison} />
              <div
                className={`mt-8 rounded-3xl p-8 border relative overflow-hidden group ${
                  isDark
                    ? "bg-indigo-500/10 border-indigo-500/20"
                    : "bg-indigo-50 border-indigo-100"
                }`}
              >
                <div className="relative z-10">
                  <h4
                    className={`font-bold text-lg mb-2 ${
                      isDark ? "text-indigo-300" : "text-indigo-900"
                    }`}
                  >
                    Smart Savings
                  </h4>
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      isDark ? "text-indigo-400" : "text-indigo-700"
                    }`}
                  >
                    {transactions.length === 0
                      ? "Add your first transaction to start tracking!"
                      : "Keep tracking your expenses to see personalized tips."}
                  </p>
                  <button
                    className={`text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  >
                    View tips <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                <PieChart
                  className={`absolute -bottom-4 -right-4 w-32 h-32 rotate-12 ${
                    isDark ? "text-indigo-500/10" : "text-indigo-600/5"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <TransactionForm onAdd={addTransaction} />
      </main>
    </div>
  );
}
