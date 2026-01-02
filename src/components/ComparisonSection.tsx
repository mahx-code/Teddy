import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ComparisonItem {
  name: string;
  currentAmount: number;
  lastAmount: number;
  change: number;
}

export function ComparisonSection({ data }: { data: ComparisonItem[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`rounded-3xl p-8 border ${
        isDark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <h3
        className={`text-xl font-bold mb-6 ${
          isDark ? "text-zinc-100" : "text-slate-900"
        }`}
      >
        Top 3 Categories vs Last Month
      </h3>
      <div className="space-y-6">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? "text-zinc-200" : "text-slate-900"
                  }`}
                >
                  {item.name}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-black ${
                      isDark ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    ${item.currentAmount.toFixed(0)}
                  </span>
                  <div
                    className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
                      item.change > 0
                        ? "text-rose-500 bg-rose-500/10"
                        : item.change < 0
                        ? "text-emerald-500 bg-emerald-500/10"
                        : isDark
                        ? "text-zinc-500 bg-zinc-800"
                        : "text-slate-500 bg-slate-50"
                    }`}
                  >
                    {item.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : item.change < 0 ? (
                      <ArrowDownRight className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {Math.abs(item.change).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                    isDark ? "text-zinc-600" : "text-slate-400"
                  }`}
                >
                  Previous
                </p>
                <p
                  className={`text-sm font-bold ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}
                >
                  ${item.lastAmount.toFixed(0)}
                </p>
              </div>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                isDark ? "bg-zinc-800" : "bg-slate-100"
              }`}
            >
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    100,
                    (item.currentAmount /
                      (item.currentAmount + item.lastAmount)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p
            className={`text-center py-10 italic ${
              isDark ? "text-zinc-600" : "text-slate-400"
            }`}
          >
            Not enough data for comparison yet.
          </p>
        )}
      </div>
    </div>
  );
}
