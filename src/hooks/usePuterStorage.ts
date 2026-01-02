import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "../types";

const DATA_PATH = "transactions.json";

export function usePuterStorage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const blob = await puter.fs.read(DATA_PATH);
      const text = await blob.text();
      const data = JSON.parse(text);
      setTransactions(data);
    } catch (err: any) {
      if (
        err?.code === "subject_does_not_exist" ||
        err?.message?.includes("does not exist")
      ) {
        setTransactions([]);
      } else {
        console.error("Failed to load data:", err);
        setError("Failed to load your transactions");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = useCallback(async (data: Transaction[]) => {
    try {
      setError(null);
      setIsSaving(true);
      const jsonContent = JSON.stringify(data, null, 2);
      await puter.fs.write(DATA_PATH, jsonContent, {
        overwrite: true,
        createMissingParents: true,
      });
    } catch (err) {
      console.error("Failed to save data:", err);
      setError("Failed to save your transactions");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, "id">) => {
      const newTransaction: Transaction = {
        ...tx,
        id: crypto.randomUUID(),
      };
      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      await saveData(updated);
    },
    [transactions, saveData]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
      await saveData(updated);
    },
    [transactions, saveData]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    transactions,
    isLoading,
    isSaving,
    error,
    addTransaction,
    deleteTransaction,
    reload: loadData,
  };
}
