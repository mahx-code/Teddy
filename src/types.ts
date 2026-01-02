export type Category =
  | "Food & Dining"
  | "Transportation"
  | "Entertainment"
  | "Shopping"
  | "Utilities"
  | "Health"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  description?: string;
}

export interface MonthlySpending {
  category: Category;
  amount: number;
}

export interface DailySpending {
  date: string;
  amount: number;
}
