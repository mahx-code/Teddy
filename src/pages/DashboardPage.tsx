import { useMemo } from "react";
import { Sidebar, TopNav } from "../components/Navigation";
import { TransactionForm } from "../components/TransactionForm";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useTheme } from "../context/ThemeContext";
import {
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  ShoppingBag,
  Receipt,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

export function DashboardPage() {
  const { transactions, addTransaction, isLoading, error } = usePuterStorage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const stats = useMemo(() => {
    if (transactions.length === 0) return null;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = thisMonthStart;

    const thisMonthTxs = transactions.filter(
      (t) => new Date(t.date) >= thisMonthStart
    );
    const lastMonthTxs = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= lastMonthStart && d < lastMonthEnd;
    });

    const thisMonthTotal = thisMonthTxs.reduce((sum, t) => sum + t.amount, 0);
    const lastMonthTotal = lastMonthTxs.reduce((sum, t) => sum + t.amount, 0);
    const percentChange =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    // Category breakdown for this month
    const categoryData = thisMonthTxs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Daily trend for this month
    const dailyMap = new Map<string, number>();
    thisMonthTxs.forEach((t) => {
      const day = new Date(t.date).getDate().toString();
      dailyMap.set(day, (dailyMap.get(day) || 0) + t.amount);
    });
    const trendData = Array.from(dailyMap.entries())
      .map(([day, amount]) => ({ day, amount }))
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));

    // Quick stats
    const avgPerDay = thisMonthTotal / (now.getDate() || 1);
    const topCategory = pieData[0]?.name || "N/A";
    const recentTransactions = transactions.slice(0, 5);

    return {
      thisMonthTotal,
      lastMonthTotal,
      percentChange,
      pieData,
      trendData,
      avgPerDay,
      topCategory,
      transactionCount: thisMonthTxs.length,
      recentTransactions,
    };
  }, [transactions]);

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

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Header */}
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
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={exportCSV}
              disabled={transactions.length === 0}
              className={`px-5 py-2.5 font-bold rounded-xl flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 transition-all ${
                isDark
                  ? "bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          {!stats ? (
            <div
              className={`text-center py-20 rounded-3xl border ${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-slate-100"
              }`}
            >
              <Receipt
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? "text-zinc-700" : "text-slate-300"
                }`}
              />
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                Welcome to Teddy!
              </h3>
              <p className={isDark ? "text-zinc-500" : "text-slate-500"}>
                Add your first transaction to see your dashboard come to life.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={DollarSign}
                  label="This Month"
                  value={`$${stats.thisMonthTotal.toFixed(2)}`}
                  change={stats.percentChange}
                  isDark={isDark}
                />
                <StatCard
                  icon={Calendar}
                  label="Daily Average"
                  value={`$${stats.avgPerDay.toFixed(2)}`}
                  isDark={isDark}
                />
                <StatCard
                  icon={ShoppingBag}
                  label="Top Category"
                  value={stats.topCategory}
                  isDark={isDark}
                />
                <StatCard
                  icon={Receipt}
                  label="Transactions"
                  value={stats.transactionCount.toString()}
                  isDark={isDark}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Spending Trend */}
                <div
                  className={`xl:col-span-2 rounded-3xl p-6 border ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isDark ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    Spending This Month
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      isDark ? "text-zinc-500" : "text-slate-500"
                    }`}
                  >
                    Daily breakdown
                  </p>
                  <div className="h-55">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.trendData}>
                        <defs>
                          <linearGradient
                            id="colorAmt"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDark ? "#27272a" : "#e2e8f0"}
                        />
                        <XAxis
                          dataKey="day"
                          stroke={isDark ? "#71717a" : "#94a3b8"}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={isDark ? "#71717a" : "#94a3b8"}
                          fontSize={11}
                          tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#18181b" : "#fff",
                            border: `1px solid ${
                              isDark ? "#27272a" : "#e2e8f0"
                            }`,
                            borderRadius: "12px",
                          }}
                          formatter={(v: number | undefined) => [
                            `$${(v || 0).toFixed(2)}`,
                            "Spent",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#6366f1"
                          fill="url(#colorAmt)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Pie */}
                <div
                  className={`rounded-3xl p-6 border ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isDark ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    By Category
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      isDark ? "text-zinc-500" : "text-slate-500"
                    }`}
                  >
                    Where your money went
                  </p>
                  <div className="h-45">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#18181b" : "#fff",
                            border: `1px solid ${
                              isDark ? "#27272a" : "#e2e8f0"
                            }`,
                            borderRadius: "12px",
                          }}
                          formatter={(v: number | undefined) => [
                            `$${(v || 0).toFixed(2)}`,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stats.pieData.slice(0, 4).map((cat, i) => (
                      <span
                        key={cat.name}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLORS[i] }}
                        />
                        <span
                          className={
                            isDark ? "text-zinc-400" : "text-slate-600"
                          }
                        >
                          {cat.name}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div
                  className={`xl:col-span-2 rounded-3xl p-6 border ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`text-lg font-bold ${
                        isDark ? "text-zinc-100" : "text-slate-900"
                      }`}
                    >
                      Recent Transactions
                    </h3>
                    <Link
                      to="/transactions"
                      className={`text-sm font-medium flex items-center gap-1 ${
                        isDark
                          ? "text-indigo-400 hover:text-indigo-300"
                          : "text-indigo-600 hover:text-indigo-700"
                      }`}
                    >
                      View all <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {stats.recentTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          isDark ? "bg-zinc-800/50" : "bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isDark
                                ? "bg-zinc-700"
                                : "bg-white border border-slate-200"
                            }`}
                          >
                            <ShoppingBag
                              className={`w-5 h-5 ${
                                isDark ? "text-zinc-400" : "text-slate-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-zinc-200" : "text-slate-900"
                              }`}
                            >
                              {tx.category}
                            </p>
                            <p
                              className={`text-xs ${
                                isDark ? "text-zinc-500" : "text-slate-500"
                              }`}
                            >
                              {new Date(tx.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-bold ${
                            isDark ? "text-zinc-100" : "text-slate-900"
                          }`}
                        >
                          -${tx.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ask Leo Card */}
                <Link to="/leo" className="block group">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`h-full rounded-3xl p-6 border transition-all ${
                      isDark
                        ? "bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 hover:border-violet-500/50"
                        : "bg-linear-to-br from-violet-50 to-fuchsia-50 border-violet-100 hover:border-violet-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3
                      className={`text-lg font-bold mb-2 ${
                        isDark ? "text-zinc-100" : "text-slate-900"
                      }`}
                    >
                      Need financial advice?
                    </h3>
                    <p
                      className={`text-sm mb-4 ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      Ask Leo, your AI advisor. Get personalized insights based
                      on your spending patterns.
                    </p>
                    <span
                      className={`text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${
                        isDark ? "text-violet-400" : "text-violet-600"
                      }`}
                    >
                      Chat with Leo <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>
              </div>
            </>
          )}
        </div>

        <TransactionForm onAdd={addTransaction} />
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  isDark,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark ? "bg-zinc-800" : "bg-slate-100"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${isDark ? "text-zinc-400" : "text-slate-600"}`}
          />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              change >= 0
                ? "text-rose-500 bg-rose-500/10"
                : "text-emerald-500 bg-emerald-500/10"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(0)}%
          </div>
        )}
      </div>
      <p
        className={`text-xs font-medium uppercase tracking-wider mb-1 ${
          isDark ? "text-zinc-500" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          isDark ? "text-zinc-100" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
