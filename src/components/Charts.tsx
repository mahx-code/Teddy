import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const COLORS = [
  "#6366f1",
  "#f472b6",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#64748b",
];

export function SpendingBarChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`rounded-3xl p-8 border h-full min-h-[400px] ${
        isDark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-zinc-100" : "text-slate-900"
            }`}
          >
            Spending by Category
          </h3>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-zinc-500" : "text-slate-500"
            }`}
          >
            Monthly breakdown
          </p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#27272a" : "#f1f5f9"}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#71717a" : "#64748b", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#71717a" : "#64748b", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: isDark ? "#27272a" : "#f8fafc" }}
              contentStyle={{
                borderRadius: "12px",
                border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => [
                `$${Number(value).toFixed(2)}`,
                "Spent",
              ]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((_, index) => (
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
  );
}

export function TrendLineChart({
  data,
}: {
  data: { date: string; amount: number }[];
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`rounded-3xl p-8 border h-full min-h-[400px] ${
        isDark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-zinc-100" : "text-slate-900"
            }`}
          >
            Spending Trend
          </h3>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-zinc-500" : "text-slate-500"
            }`}
          >
            Last 30 days
          </p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#27272a" : "#f1f5f9"}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#71717a" : "#64748b", fontSize: 10 }}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#71717a" : "#64748b", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => [
                `$${Number(value).toFixed(2)}`,
                "Spent",
              ]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
