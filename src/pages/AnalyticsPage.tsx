import { useState, useMemo } from "react";
import { Sidebar, TopNav } from "../components/Navigation";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useTheme } from "../context/ThemeContext";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ShoppingBag,
  Percent,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
];

export function AnalyticsPage() {
  const { transactions, isLoading } = usePuterStorage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [period, setPeriod] = useState<TimePeriod>("monthly");

  const analytics = useMemo(() => {
    if (transactions.length === 0) return null;

    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousStartDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
        previousEndDate = startDate;
        break;
      case "weekly":
        const dayOfWeek = now.getDay();
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - dayOfWeek
        );
        previousStartDate = new Date(
          startDate.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        previousEndDate = startDate;
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = startDate;
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        previousEndDate = startDate;
        break;
    }

    const currentTransactions = transactions.filter(
      (t) => new Date(t.date) >= startDate
    );
    const previousTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= previousStartDate && date < previousEndDate;
    });

    const currentTotal = currentTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const previousTotal = previousTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const percentChange =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : 0;

    // Category breakdown
    const categoryData = currentTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Trend data
    const trendMap = new Map<string, number>();
    currentTransactions.forEach((t) => {
      const date = new Date(t.date);
      let key: string;
      if (period === "daily") {
        key = `${date.getHours()}:00`;
      } else if (period === "weekly") {
        key = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
      } else if (period === "monthly") {
        key = date.getDate().toString();
      } else {
        key = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][date.getMonth()];
      }
      trendMap.set(key, (trendMap.get(key) || 0) + t.amount);
    });

    const trendData = Array.from(trendMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => {
        if (period === "daily" || period === "monthly") {
          return parseInt(a.name) - parseInt(b.name);
        } else if (period === "weekly") {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return days.indexOf(a.name) - days.indexOf(b.name);
        } else {
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return months.indexOf(a.name) - months.indexOf(b.name);
        }
      });

    // Stats
    const avgPerDay =
      currentTotal /
      (period === "daily"
        ? 1
        : period === "weekly"
        ? 7
        : period === "monthly"
        ? 30
        : 365);
    const topCategory = pieData[0]?.name || "N/A";
    const transactionCount = currentTransactions.length;

    return {
      currentTotal,
      previousTotal,
      percentChange,
      pieData,
      trendData,
      avgPerDay,
      topCategory,
      transactionCount,
    };
  }, [transactions, period]);

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNav />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                Analytics
              </h1>
              <p
                className={`mt-1 ${
                  isDark ? "text-zinc-500" : "text-slate-500"
                }`}
              >
                Deep dive into your spending patterns
              </p>
            </div>

            {/* Time Period Selector */}
            <div
              className={`flex gap-1 p-1 rounded-xl ${
                isDark ? "bg-zinc-900" : "bg-slate-100"
              }`}
            >
              {(["daily", "weekly", "monthly", "yearly"] as TimePeriod[]).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      period === p
                        ? "bg-indigo-600 text-white"
                        : isDark
                        ? "text-zinc-400 hover:text-zinc-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : !analytics ? (
            <div
              className={`text-center py-20 rounded-3xl border ${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-slate-100"
              }`}
            >
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                No data to analyze
              </h3>
              <p className={isDark ? "text-zinc-500" : "text-slate-500"}>
                Add some transactions to see your analytics.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  icon={DollarSign}
                  label="Total Spent"
                  value={`$${analytics.currentTotal.toFixed(2)}`}
                  change={analytics.percentChange}
                  isDark={isDark}
                />
                <StatCard
                  icon={TrendingUp}
                  label="Avg per Day"
                  value={`$${analytics.avgPerDay.toFixed(2)}`}
                  isDark={isDark}
                />
                <StatCard
                  icon={ShoppingBag}
                  label="Top Category"
                  value={analytics.topCategory}
                  isDark={isDark}
                />
                <StatCard
                  icon={Percent}
                  label="Transactions"
                  value={analytics.transactionCount.toString()}
                  isDark={isDark}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Spending Trend */}
                <div
                  className={`rounded-3xl p-6 border ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-6 ${
                      isDark ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    Spending Trend
                  </h3>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.trendData}>
                        <defs>
                          <linearGradient
                            id="colorAmount"
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
                          dataKey="name"
                          stroke={isDark ? "#71717a" : "#94a3b8"}
                          fontSize={12}
                        />
                        <YAxis
                          stroke={isDark ? "#71717a" : "#94a3b8"}
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#18181b" : "#ffffff",
                            border: `1px solid ${
                              isDark ? "#27272a" : "#e2e8f0"
                            }`,
                            borderRadius: "12px",
                          }}
                          formatter={(value: number) => [
                            `$${value.toFixed(2)}`,
                            "Amount",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#6366f1"
                          fill="url(#colorAmount)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div
                  className={`rounded-3xl p-6 border ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-6 ${
                      isDark ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    Category Breakdown
                  </h3>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.pieData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#18181b" : "#ffffff",
                            border: `1px solid ${
                              isDark ? "#27272a" : "#e2e8f0"
                            }`,
                            borderRadius: "12px",
                          }}
                          formatter={(value: number) => [
                            `$${value.toFixed(2)}`,
                            "Amount",
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Comparison Bar Chart */}
              <div
                className={`rounded-3xl p-6 border ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-slate-100"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-6 ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  Spending by Category
                </h3>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.pieData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? "#27272a" : "#e2e8f0"}
                      />
                      <XAxis
                        type="number"
                        stroke={isDark ? "#71717a" : "#94a3b8"}
                        fontSize={12}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke={isDark ? "#71717a" : "#94a3b8"}
                        fontSize={12}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#18181b" : "#ffffff",
                          border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                          borderRadius: "12px",
                        }}
                        formatter={(value: number) => [
                          `$${value.toFixed(2)}`,
                          "Amount",
                        ]}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {analytics.pieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
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
      className={`rounded-2xl p-6 border ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
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
            className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${
              change >= 0
                ? "text-rose-500 bg-rose-500/10"
                : "text-emerald-500 bg-emerald-500/10"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(change).toFixed(0)}%
          </div>
        )}
      </div>
      <p
        className={`text-sm font-medium uppercase tracking-wider mb-1 ${
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
