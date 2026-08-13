export type PredefinedCategory =
  | 'Food & Dining'
  | 'Groceries'
  | 'Rent'
  | 'Electricity'
  | 'Mobile & Internet'
  | 'Transport/Fuel'
  | 'Medical'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Travel'
  | 'EMI/Loans'
  | 'Subscriptions'
  | 'Insurance'
  | 'Other';

export type ExpenseCategory = string;

export interface CustomCategoryInfo {
  name: string;
  emoji: string;
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
  dotColor: string;
  description: string;
  icon?: string;
  isCustom?: boolean;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  note?: string | null;
  created_at: string;
}

export interface ExpenseFormData {
  amount: number | string;
  category: ExpenseCategory;
  date: string;
  note: string;
}

export interface ExpenseFilter {
  category: string; // 'ALL' or specific ExpenseCategory
  startDate: string; // YYYY-MM-DD or ''
  endDate: string; // YYYY-MM-DD or ''
  search: string;
  quickRange: 'ALL' | 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_YEAR' | 'CUSTOM';
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  color: string;
  bgLight: string;
  border: string;
}

export interface MonthlyStats {
  totalSpendCurrentMonth: number;
  totalSpendPreviousMonth: number;
  percentageChange: number;
  totalTransactionsCount: number;
  topCategory: ExpenseCategory | 'None';
  averageDailySpend: number;
  monthlyBudget: number;
  availableBalance: number;
  categoryBreakdown: CategorySummary[];
}
