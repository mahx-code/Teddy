import { Sidebar, TopNav } from "../components/Navigation";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useTheme } from "../context/ThemeContext";
import { Trash2, Loader2, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TransactionsPage() {
  const { transactions, deleteTransaction, isLoading } = usePuterStorage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNav />

        <div className="p-8 max-w-4xl mx-auto">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-zinc-100" : "text-slate-900"
            }`}
          >
            Transactions
          </h1>
          <p className={`mb-8 ${isDark ? "text-zinc-500" : "text-slate-500"}`}>
            View and manage all your transactions.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
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
                No transactions yet
              </h3>
              <p className={isDark ? "text-zinc-500" : "text-slate-500"}>
                Click the + button to add your first transaction.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-3xl border overflow-hidden ${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-slate-100"
              }`}
            >
              <table className="w-full">
                <thead
                  className={`border-b ${
                    isDark
                      ? "bg-zinc-800 border-zinc-700"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <tr>
                    <th
                      className={`text-left py-4 px-6 text-sm font-semibold uppercase tracking-wider ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`text-left py-4 px-6 text-sm font-semibold uppercase tracking-wider ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      Category
                    </th>
                    <th
                      className={`text-left py-4 px-6 text-sm font-semibold uppercase tracking-wider ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      Description
                    </th>
                    <th
                      className={`text-right py-4 px-6 text-sm font-semibold uppercase tracking-wider ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      Amount
                    </th>
                    <th
                      className={`text-right py-4 px-6 text-sm font-semibold uppercase tracking-wider ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {transactions.map((tx) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-zinc-800 hover:bg-zinc-800/50"
                            : "border-slate-50 hover:bg-slate-50/50"
                        }`}
                      >
                        <td
                          className={`py-4 px-6 ${
                            isDark ? "text-zinc-200" : "text-slate-900"
                          }`}
                        >
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-lg ${
                              isDark
                                ? "bg-indigo-500/20 text-indigo-400"
                                : "bg-indigo-50 text-indigo-700"
                            }`}
                          >
                            {tx.category}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-6 ${
                            isDark ? "text-zinc-400" : "text-slate-600"
                          }`}
                        >
                          {tx.description || "-"}
                        </td>
                        <td
                          className={`py-4 px-6 text-right font-bold ${
                            isDark ? "text-zinc-100" : "text-slate-900"
                          }`}
                        >
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark
                                ? "text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                                : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
