import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface MetricProps {
  label: string;
  value: string;
  subtext: string;
  trend?: number;
  icon: React.ElementType;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon: Icon,
  className = "",
}: MetricProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-3xl p-6 border flex flex-col justify-between ${
        isDark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-slate-100 shadow-sm"
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isDark ? "bg-zinc-800" : "bg-slate-50"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${isDark ? "text-zinc-400" : "text-slate-600"}`}
          />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${
              trend >= 0
                ? "text-rose-500 bg-rose-500/10"
                : "text-emerald-500 bg-emerald-500/10"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(trend).toFixed(0)}%
          </div>
        )}
      </div>
      <div>
        <p
          className={`text-sm font-medium uppercase tracking-wider mb-1 ${
            isDark ? "text-zinc-500" : "text-slate-500"
          }`}
        >
          {label}
        </p>
        <h2
          className={`text-3xl font-black mb-1 ${
            isDark ? "text-zinc-100" : "text-slate-900"
          }`}
        >
          {value}
        </h2>
        <p className={`text-sm ${isDark ? "text-zinc-600" : "text-slate-400"}`}>
          {subtext}
        </p>
      </div>
    </motion.div>
  );
}

export function InsightBanner({ insight }: { insight: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 flex items-center gap-4 ${
        isDark
          ? "bg-indigo-500/20 border border-indigo-500/30"
          : "bg-indigo-600 shadow-lg shadow-indigo-600/20"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isDark ? "bg-indigo-500/30" : "bg-white/20"
        }`}
      >
        <AlertCircle
          className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-white"}`}
        />
      </div>
      <div className="flex-1">
        <p
          className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${
            isDark ? "text-indigo-400" : "text-indigo-100"
          }`}
        >
          Automated Insight
        </p>
        <p
          className={`font-semibold text-lg ${
            isDark ? "text-indigo-300" : "text-white"
          }`}
        >
          {insight}
        </p>
      </div>
    </motion.div>
  );
}
