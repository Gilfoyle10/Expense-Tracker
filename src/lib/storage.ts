import { Expense, ExpenseCategory, ExpenseFilter, ExpenseFormData, MonthlyStats } from './types';
import { createClient, isSupabaseConfigured } from './supabase/client';
import { getCategoryConfig, getActiveCategories, getMonthlyIncome } from './constants';

const DEMO_USER_ID = 'demo-user-default';

// User-scoped LocalStorage Key Helper
const getUserStorageKey = async (): Promise<{ userId: string; storageKey: string }> => {
  if (typeof window === 'undefined') {
    return { userId: DEMO_USER_ID, storageKey: `expense_tracker_${DEMO_USER_ID}_expenses` };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        return { userId: data.user.id, storageKey: `expense_tracker_${data.user.id}_expenses` };
      }
    } catch {
      // Fallback
    }
  }

  let sessionKey = localStorage.getItem('expense_tracker_active_session_user');
  if (!sessionKey) {
    sessionKey = 'demo_user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('expense_tracker_active_session_user', sessionKey);
  }
  return { userId: sessionKey, storageKey: `expense_tracker_${sessionKey}_expenses` };
};

const getLocalUserExpenses = (storageKey: string): Expense[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(storageKey);
    if (data === null) {
      return [];
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveLocalUserExpenses = (storageKey: string, expenses: Expense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

export function validateExpenseInput(
  formData: ExpenseFormData
): { valid: boolean; error?: string; parsedAmount?: number } {
  const rawAmount = typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount;

  if (isNaN(rawAmount) || rawAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than ₹0.00' };
  }

  const parsedAmount = Math.round(rawAmount * 100) / 100;

  if (!formData.date || isNaN(new Date(formData.date + 'T00:00:00').getTime())) {
    return { valid: false, error: 'Please enter a valid transaction date' };
  }

  if (!formData.category) {
    return { valid: false, error: 'Category selection is mandatory' };
  }

  return { valid: true, parsedAmount };
}

export async function fetchExpenses(filter?: ExpenseFilter): Promise<{ expenses: Expense[]; isDemo: boolean }> {
  const configured = isSupabaseConfigured();

  if (configured) {
    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.warn('Supabase user auth warning:', userError.message);
      }

      if (userData?.user) {
        let query = supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false });

        if (filter) {
          if (filter.category && filter.category !== 'ALL') {
            query = query.eq('category', filter.category);
          }
          if (filter.startDate) {
            query = query.gte('date', filter.startDate);
          }
          if (filter.endDate) {
            query = query.lte('date', filter.endDate);
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          // If table error or permission error, throw error so UI displays notice
        } else if (data) {
          let result = data as Expense[];
          if (filter?.search) {
            const s = filter.search.toLowerCase();
            result = result.filter(
              (item) =>
                (item.note && item.note.toLowerCase().includes(s)) ||
                item.category.toLowerCase().includes(s) ||
                item.amount.toString().includes(s)
            );
          }
          return { expenses: result, isDemo: false };
        }
      }
    } catch (err) {
      console.warn('Supabase fetch exception:', err);
    }
  }

  const { storageKey } = await getUserStorageKey();
  let items = getLocalUserExpenses(storageKey);

  if (filter) {
    if (filter.category && filter.category !== 'ALL') {
      items = items.filter((item) => item.category === filter.category);
    }
    if (filter.startDate) {
      items = items.filter((item) => item.date >= filter.startDate);
    }
    if (filter.endDate) {
      items = items.filter((item) => item.date <= filter.endDate);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      items = items.filter(
        (item) =>
          (item.note && item.note.toLowerCase().includes(s)) ||
          item.category.toLowerCase().includes(s) ||
          item.amount.toString().includes(s)
      );
    }
  }

  items.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return { expenses: items, isDemo: !configured };
}

export async function addExpense(
  formData: ExpenseFormData
): Promise<{ success: boolean; data?: Expense; error?: string }> {
  const val = validateExpenseInput(formData);
  if (!val.valid || val.parsedAmount === undefined) {
    return { success: false, error: val.error };
  }

  const amountNum = val.parsedAmount;
  const configured = isSupabaseConfigured();
  const { userId, storageKey } = await getUserStorageKey();

  if (configured) {
    try {
      const supabase = createClient();
      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData?.user) {
        return { success: false, error: 'User session expired or not authenticated. Please log in again.' };
      }

      const newExpense = {
        amount: amountNum,
        category: formData.category,
        date: formData.date,
        note: formData.note ? formData.note.trim() : null,
        user_id: userData.user.id,
      };

      const { data, error } = await supabase.from('expenses').insert([newExpense]).select().single();

      if (error) {
        console.error('Supabase Insert Error:', error);
        return {
          success: false,
          error: `Database Insert Error (${error.code || 'RLS'}): ${error.message}`,
        };
      }

      if (data) {
        return { success: true, data: data as Expense };
      }
    } catch (e: any) {
      console.error('Supabase insert exception:', e);
      return { success: false, error: e?.message || 'Database connection error' };
    }
  }

  // Fallback ONLY when Supabase is explicitly NOT configured
  const items = getLocalUserExpenses(storageKey);
  const created: Expense = {
    id: 'exp-' + Date.now(),
    user_id: userId,
    amount: amountNum,
    category: formData.category,
    date: formData.date,
    note: formData.note ? formData.note.trim() : null,
    created_at: new Date().toISOString(),
  };

  items.unshift(created);
  saveLocalUserExpenses(storageKey, items);
  return { success: true, data: created };
}

export async function updateExpense(
  id: string,
  formData: ExpenseFormData
): Promise<{ success: boolean; data?: Expense; error?: string }> {
  const val = validateExpenseInput(formData);
  if (!val.valid || val.parsedAmount === undefined) {
    return { success: false, error: val.error };
  }

  const amountNum = val.parsedAmount;
  const configured = isSupabaseConfigured();

  if (configured) {
    try {
      const supabase = createClient();
      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData?.user) {
        return { success: false, error: 'User session expired. Please log in again.' };
      }

      const payload = {
        amount: amountNum,
        category: formData.category,
        date: formData.date,
        note: formData.note ? formData.note.trim() : null,
      };

      const { data, error } = await supabase
        .from('expenses')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userData.user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase Update Error:', error);
        return { success: false, error: `Database Update Error: ${error.message}` };
      }

      if (data) {
        return { success: true, data: data as Expense };
      }
    } catch (e: any) {
      console.error('Supabase update exception:', e);
      return { success: false, error: e?.message || 'Database connection error' };
    }
  }

  const { storageKey } = await getUserStorageKey();
  const items = getLocalUserExpenses(storageKey);

  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    return { success: false, error: 'Expense not found.' };
  }

  items[index] = {
    ...items[index],
    amount: amountNum,
    category: formData.category,
    date: formData.date,
    note: formData.note ? formData.note.trim() : null,
  };

  saveLocalUserExpenses(storageKey, items);
  return { success: true, data: items[index] };
}

export async function deleteExpense(id: string): Promise<{ success: boolean; error?: string }> {
  const configured = isSupabaseConfigured();

  if (configured) {
    try {
      const supabase = createClient();
      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData?.user) {
        return { success: false, error: 'User session expired. Please log in again.' };
      }

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('Supabase Delete Error:', error);
        return { success: false, error: `Database Delete Error: ${error.message}` };
      }

      return { success: true };
    } catch (e: any) {
      console.error('Supabase delete exception:', e);
      return { success: false, error: e?.message || 'Database connection error' };
    }
  }

  const { storageKey } = await getUserStorageKey();
  let items = getLocalUserExpenses(storageKey);
  items = items.filter((i) => i.id !== id);
  saveLocalUserExpenses(storageKey, items);
  return { success: true };
}

export function calculateMonthlyStats(
  expenses: Expense[],
  targetDate: Date = new Date(),
  budget: number = getMonthlyIncome()
): MonthlyStats {
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();

  let totalSpendCurrentMonth = 0;
  let totalSpendPreviousMonth = 0;
  let currentMonthCount = 0;

  const activeCategories = getActiveCategories();
  const categoryTotals: Record<string, { total: number; count: number }> = {};
  activeCategories.forEach((cat) => {
    categoryTotals[cat] = { total: 0, count: 0 };
  });

  expenses.forEach((item) => {
    const itemDate = new Date(item.date + 'T00:00:00');
    const y = itemDate.getFullYear();
    const m = itemDate.getMonth();

    if (y === currentYear && m === currentMonth) {
      totalSpendCurrentMonth += Number(item.amount);
      currentMonthCount++;
      if (categoryTotals[item.category]) {
        categoryTotals[item.category].total += Number(item.amount);
        categoryTotals[item.category].count += 1;
      }
    } else if (y === prevYear && m === prevMonth) {
      totalSpendPreviousMonth += Number(item.amount);
    }
  });

  let percentageChange = 0;
  if (totalSpendPreviousMonth > 0) {
    percentageChange = ((totalSpendCurrentMonth - totalSpendPreviousMonth) / totalSpendPreviousMonth) * 100;
  }

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([cat, data]) => {
      const config = getCategoryConfig(cat);
      const percentage = totalSpendCurrentMonth > 0 ? (data.total / totalSpendCurrentMonth) * 100 : 0;
      return {
        category: cat,
        total: data.total,
        count: data.count,
        percentage: Number(percentage.toFixed(1)),
        color: config.color,
        bgLight: config.badgeBg,
        border: config.badgeBorder,
      };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : 'None';

  const now = new Date();
  const daysInMonth =
    now.getFullYear() === currentYear && now.getMonth() === currentMonth ? now.getDate() : 30;
  const averageDailySpend = totalSpendCurrentMonth / (daysInMonth || 1);

  const availableBalance = budget - totalSpendCurrentMonth;

  return {
    totalSpendCurrentMonth: Number(totalSpendCurrentMonth.toFixed(2)),
    totalSpendPreviousMonth: Number(totalSpendPreviousMonth.toFixed(2)),
    percentageChange: Number(percentageChange.toFixed(1)),
    totalTransactionsCount: currentMonthCount,
    topCategory,
    averageDailySpend: Number(averageDailySpend.toFixed(2)),
    monthlyBudget: budget,
    availableBalance: Number(availableBalance.toFixed(2)),
    categoryBreakdown,
  };
}
