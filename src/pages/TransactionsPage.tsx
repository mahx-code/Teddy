import { useState } from "react";
import { Sidebar, TopNav } from "../components/Navigation";
import { TransactionForm } from "../components/TransactionForm";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useTheme } from "../context/ThemeContext";
import { Trash2, Loader2, Receipt, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction, isLoading } =
    usePuterStorage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteId);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative pb-20">
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
                            onClick={() => setDeleteId(tx.id)}
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

        <TransactionForm onAdd={addTransaction} />

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteId(null)}
                className={`absolute inset-0 backdrop-blur-sm ${
                  isDark ? "bg-black/60" : "bg-slate-900/40"
                }`}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-2xl p-6 w-full max-w-sm relative z-10 text-center ${
                  isDark
                    ? "bg-zinc-900 border border-zinc-800"
                    : "bg-white shadow-2xl"
                }`}
              >
                <button
                  onClick={() => setDeleteId(null)}
                  className={`absolute top-4 right-4 ${
                    isDark
                      ? "text-zinc-500 hover:text-zinc-300"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-rose-500" />
                </div>

                <h3
                  className={`text-lg font-bold mb-2 ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  Delete Transaction?
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  This action cannot be undone. The transaction will be
                  permanently removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className={`flex-1 py-2.5 font-medium rounded-xl transition-colors ${
                      isDark
                        ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
