import { ExpenseCategory, CustomCategoryInfo } from './types';

export const INITIAL_PREDEFINED_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Groceries',
  'Rent',
  'Electricity',
  'Mobile & Internet',
  'Transport/Fuel',
  'Medical',
  'Education',
  'Shopping',
  'Entertainment',
  'Travel',
  'EMI/Loans',
  'Subscriptions',
  'Insurance',
  'Other',
];

export const CATEGORY_CONFIG: Record<string, CustomCategoryInfo> = {
  'Food & Dining': {
    name: 'Food & Dining',
    label: 'Food & Dining',
    emoji: '🍛',
    color: '#F59E0B',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    barColor: 'bg-amber-500',
    dotColor: 'bg-amber-500',
    description: 'Restaurants, food delivery, cafes & dining out',
  },
  Groceries: {
    name: 'Groceries',
    label: 'Groceries',
    emoji: '🛒',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    barColor: 'bg-emerald-500',
    dotColor: 'bg-emerald-500',
    description: 'Vegetables, milk, ration, supermarket items',
  },
  Rent: {
    name: 'Rent',
    label: 'Rent',
    emoji: '🏠',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
    barColor: 'bg-purple-500',
    dotColor: 'bg-purple-500',
    description: 'House rent, maintenance & society charges',
  },
  Electricity: {
    name: 'Electricity',
    label: 'Electricity',
    emoji: '💡',
    color: '#EAB308',
    badgeBg: 'bg-yellow-500/15',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-500/30',
    barColor: 'bg-yellow-500',
    dotColor: 'bg-yellow-500',
    description: 'Monthly power electricity bills',
  },
  'Mobile & Internet': {
    name: 'Mobile & Internet',
    label: 'Mobile & Internet',
    emoji: '📱',
    color: '#06B6D4',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    barColor: 'bg-cyan-500',
    dotColor: 'bg-cyan-500',
    description: 'Mobile recharge, fiber Wi-Fi broadband, DTH',
  },
  'Transport/Fuel': {
    name: 'Transport/Fuel',
    label: 'Transport/Fuel',
    emoji: '🚗',
    color: '#3B82F6',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
    barColor: 'bg-blue-500',
    dotColor: 'bg-blue-500',
    description: 'Petrol/diesel, metro, auto, cab & tolls',
  },
  Medical: {
    name: 'Medical',
    label: 'Medical',
    emoji: '🏥',
    color: '#EF4444',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    barColor: 'bg-rose-500',
    dotColor: 'bg-rose-500',
    description: 'Doctor fees, pharmacy, hospital tests & medicines',
  },
  Education: {
    name: 'Education',
    label: 'Education',
    emoji: '🎓',
    color: '#6366F1',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    barColor: 'bg-indigo-500',
    dotColor: 'bg-indigo-500',
    description: 'School/college fees, coaching, books & courses',
  },
  Shopping: {
    name: 'Shopping',
    label: 'Shopping',
    emoji: '🛍️',
    color: '#EC4899',
    badgeBg: 'bg-pink-500/15',
    badgeText: 'text-pink-300',
    badgeBorder: 'border-pink-500/30',
    barColor: 'bg-pink-500',
    dotColor: 'bg-pink-500',
    description: 'Clothes, electronics, footwear & online shopping',
  },
  Entertainment: {
    name: 'Entertainment',
    label: 'Entertainment',
    emoji: '🎬',
    color: '#D946EF',
    badgeBg: 'bg-fuchsia-500/15',
    badgeText: 'text-fuchsia-300',
    badgeBorder: 'border-fuchsia-500/30',
    barColor: 'bg-fuchsia-500',
    dotColor: 'bg-fuchsia-500',
    description: 'Movies, concerts, gaming & weekend outings',
  },
  Travel: {
    name: 'Travel',
    label: 'Travel',
    emoji: '✈️',
    color: '#0284C7',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/30',
    barColor: 'bg-sky-500',
    dotColor: 'bg-sky-500',
    description: 'Flights, train tickets, hotels & vacations',
  },
  'EMI/Loans': {
    name: 'EMI/Loans',
    label: 'EMI/Loans',
    emoji: '💳',
    color: '#7C3AED',
    badgeBg: 'bg-violet-500/15',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-500/30',
    barColor: 'bg-violet-500',
    dotColor: 'bg-violet-500',
    description: 'Home loan, car loan, credit card EMI & installments',
  },
  Subscriptions: {
    name: 'Subscriptions',
    label: 'Subscriptions',
    emoji: '🔁',
    color: '#14B8A6',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
    barColor: 'bg-teal-500',
    dotColor: 'bg-teal-500',
    description: 'Netflix, Prime, Spotify, Hotstar, newspaper & apps',
  },
  Insurance: {
    name: 'Insurance',
    label: 'Insurance',
    emoji: '🧾',
    color: '#F97316',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/30',
    barColor: 'bg-orange-500',
    dotColor: 'bg-orange-500',
    description: 'Health, term life, vehicle & health insurance premium',
  },
  Other: {
    name: 'Other',
    label: 'Other',
    emoji: '📦',
    color: '#6B7280',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-500/30',
    barColor: 'bg-slate-500',
    dotColor: 'bg-slate-500',
    description: 'Misc expenses, gifts & unmapped payments',
  },
};

export const DEFAULT_MONTHLY_INCOME = 0; // Default zero for new accounts

export const getCurrentUserPrefix = (): string => {
  if (typeof window === 'undefined') return 'guest';
  try {
    const activeUser = localStorage.getItem('expense_tracker_active_session_user');
    if (activeUser) return activeUser;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('sb-') && key.includes('-auth-token')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed?.user?.id) {
            return parsed.user.id;
          }
        }
      }
    }
  } catch {}
  return 'default_user';
};

const getMonthlyIncomeKey = () => `expense_tracker_${getCurrentUserPrefix()}_monthly_income_v3`;
const getCustomCategoriesKey = () => `expense_tracker_${getCurrentUserPrefix()}_custom_categories_v3`;
const getDeletedCategoriesKey = () => `expense_tracker_${getCurrentUserPrefix()}_deleted_categories_v3`;

export const getMonthlyIncome = (): number => {
  if (typeof window === 'undefined') return DEFAULT_MONTHLY_INCOME;
  try {
    const stored = localStorage.getItem(getMonthlyIncomeKey());
    if (stored !== null) {
      const val = parseFloat(stored);
      if (!isNaN(val) && val >= 0) return val;
    }
    return DEFAULT_MONTHLY_INCOME;
  } catch {
    return DEFAULT_MONTHLY_INCOME;
  }
};

export const setMonthlyIncome = (income: number): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getMonthlyIncomeKey(), income.toString());
  } catch (e) {
    console.error('Failed to save monthly income', e);
  }
};

export const getDeletedCategories = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(getDeletedCategoriesKey());
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getCustomCategories = (): CustomCategoryInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(getCustomCategoriesKey());
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCustomCategory = (
  categoryName: string,
  emoji: string = '✨',
  description: string = 'Custom Category'
): CustomCategoryInfo => {
  const existing = getCustomCategories();
  const trimmedName = categoryName.trim();

  let deleted = getDeletedCategories();
  if (deleted.includes(trimmedName)) {
    deleted = deleted.filter((d) => d !== trimmedName);
    if (typeof window !== 'undefined') {
      localStorage.setItem(getDeletedCategoriesKey(), JSON.stringify(deleted));
    }
  }

  const found = existing.find((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
  if (found) return found;

  const newCat: CustomCategoryInfo = {
    name: trimmedName,
    label: trimmedName,
    emoji: emoji || '✨',
    color: '#6366F1',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    barColor: 'bg-indigo-500',
    dotColor: 'bg-indigo-500',
    description: description || 'Custom Category',
    isCustom: true,
  };

  const updated = [...existing, newCat];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(getCustomCategoriesKey(), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom category:', e);
    }
  }
  return newCat;
};

export const deleteCategory = (categoryName: string): boolean => {
  if (typeof window === 'undefined') return false;

  const custom = getCustomCategories();
  const filteredCustom = custom.filter((c) => c.name !== categoryName);
  localStorage.setItem(getCustomCategoriesKey(), JSON.stringify(filteredCustom));

  const deleted = getDeletedCategories();
  if (!deleted.includes(categoryName)) {
    deleted.push(categoryName);
    localStorage.setItem(getDeletedCategoriesKey(), JSON.stringify(deleted));
  }

  return true;
};

export const getActiveCategories = (): ExpenseCategory[] => {
  const deleted = getDeletedCategories();
  const custom = getCustomCategories().map((c) => c.name);

  const combined = [...INITIAL_PREDEFINED_CATEGORIES, ...custom];
  return combined.filter((c) => !deleted.includes(c));
};

export const getCategoryConfig = (categoryName: string): CustomCategoryInfo => {
  if (CATEGORY_CONFIG[categoryName]) {
    return CATEGORY_CONFIG[categoryName];
  }
  const custom = getCustomCategories().find((c) => c.name === categoryName);
  if (custom) return custom;

  return {
    name: categoryName,
    label: categoryName,
    emoji: '✨',
    color: '#64748B',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-500/30',
    barColor: 'bg-slate-500',
    dotColor: 'bg-slate-500',
    description: 'Category',
  };
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = INITIAL_PREDEFINED_CATEGORIES;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getMonthName = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date);
};
