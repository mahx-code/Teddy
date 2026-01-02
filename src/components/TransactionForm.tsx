import { useState } from "react";
import type { Category } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface Props {
  onAdd: (tx: {
    amount: number;
    category: Category;
    date: string;
    description: string;
  }) => Promise<void> | void;
}

const CATEGORIES: Category[] = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Other",
];

export function TransactionForm({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    try {
      await onAdd({
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        description,
      });
      setAmount("");
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 overflow-hidden"
      >
        <Plus className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className={`absolute inset-0 backdrop-blur-sm ${
                isDark ? "bg-black/60" : "bg-slate-900/40"
              }`}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`rounded-2xl p-8 w-full max-w-md relative z-10 ${
                isDark
                  ? "bg-zinc-900 border border-zinc-800"
                  : "bg-white shadow-2xl"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  Add Transaction
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors ${
                    isDark
                      ? "text-zinc-500 hover:text-zinc-300"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${
                        isDark ? "text-zinc-500" : "text-slate-400"
                      }`}
                    >
                      $
                    </span>
                    <input
                      autoFocus
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      className={`w-full rounded-xl py-2.5 pl-8 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${
                        isDark
                          ? "bg-zinc-800 border border-zinc-700 text-zinc-100"
                          : "bg-slate-50 border border-slate-200 text-slate-900"
                      }`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Category
                  </label>
                  <select
                    className={`w-full rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${
                      isDark
                        ? "bg-zinc-800 border border-zinc-700 text-zinc-100"
                        : "bg-slate-50 border border-slate-200 text-slate-900"
                    }`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    className={`w-full rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${
                      isDark
                        ? "bg-zinc-800 border border-zinc-700 text-zinc-100"
                        : "bg-slate-50 border border-slate-200 text-slate-900"
                    }`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Lunch, Groceries, etc."
                    className={`w-full rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${
                      isDark
                        ? "bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95 transform"
                >
                  Save Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
