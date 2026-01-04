import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar, TopNav } from "../components/Navigation";
import { TransactionForm } from "../components/TransactionForm";
import { usePuterStorage } from "../hooks/usePuterStorage";
import {
  Trash2,
  Loader2,
  Receipt,
  AlertTriangle,
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction, isLoading } =
    usePuterStorage();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const lowerQuery = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.category.toLowerCase().includes(lowerQuery) ||
        (tx.description && tx.description.toLowerCase().includes(lowerQuery))
    );
  }, [transactions, searchQuery]);

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
    <div className="min-h-screen flex bg-[var(--color-bg-main)]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative pb-20">
        <TopNav />

        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">
            Transactions
          </h1>
          <p className="mb-4 text-[var(--color-text-muted)]">
            View and manage all your transactions.
          </p>

          {searchQuery && (
            <div className="mb-6 p-3 bg-[var(--color-bg-card)] border border-[var(--color-border-standard)] rounded-xl flex items-center gap-2 text-[var(--color-text-body)]">
              <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span>
                Showing results for:{" "}
                <span className="font-bold">"{searchQuery}"</span>
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[var(--color-status-info)] animate-spin" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border bg-[var(--color-bg-card)] border-[var(--color-border-standard)]">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-placeholder)]" />
              <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">
                {searchQuery
                  ? "No matching transactions"
                  : "No transactions yet"}
              </h3>
              <p className="text-[var(--color-text-muted)]">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Click the + button to add your first transaction."}
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border overflow-hidden bg-[var(--color-bg-card)] border-[var(--color-border-standard)]">
              <table className="w-full">
                <thead className="border-b bg-[var(--color-bg-card)] border-[var(--color-border-standard)]">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Description
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Amount
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredTransactions.map((tx) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="border-b transition-colors border-[var(--color-border-standard)] hover:bg-[var(--color-bg-main)]"
                      >
                        <td className="py-4 px-6 text-[var(--color-text-body)]">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[var(--color-text-muted)]">
                          {tx.description || "-"}
                        </td>
                        <td
                          className={`py-4 px-6 text-right font-bold ${
                            tx.amount >= 0
                              ? "text-[var(--color-expense)]"
                              : "text-[var(--color-income)]"
                          }`}
                        >
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="p-2 rounded-lg transition-all text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] hover:bg-red-50"
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
                className="absolute inset-0 backdrop-blur-sm bg-black/60"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="rounded-2xl p-6 w-full max-w-sm relative z-10 text-center bg-[var(--color-bg-modal)] shadow-2xl"
              >
                <button
                  onClick={() => setDeleteId(null)}
                  className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-[var(--color-status-error)]" />
                </div>

                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">
                  Delete Transaction?
                </h3>
                <p className="text-sm mb-6 text-[var(--color-text-muted)]">
                  This action cannot be undone. The transaction will be
                  permanently removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 font-medium rounded-xl transition-colors bg-[var(--color-btn-secondary-bg)] text-[var(--color-btn-secondary-text)] hover:bg-[var(--color-btn-secondary-hover)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 font-bold rounded-xl bg-[var(--color-status-error)] text-white hover:bg-red-600 transition-colors disabled:bg-[var(--color-btn-disabled-bg)] disabled:text-[var(--color-btn-disabled-text)] disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
