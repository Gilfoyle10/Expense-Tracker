'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/lib/types';
import { getActiveCategories } from '@/lib/constants';
import { CategoryBadge } from './CategoryBadge';
import {
  X,
  Calendar,
  IndianRupee,
  AlertCircle,
  Receipt,
} from 'lucide-react';

interface ExpenseDetailPanelProps {
  expense: Expense | null;
  onClose: () => void;
  onUpdate: (id: string, formData: ExpenseFormData) => Promise<boolean>;
  onDeleteRequest: (expense: Expense) => void;
  availableBalance?: number;
}

export const ExpenseDetailPanel: React.FC<ExpenseDetailPanelProps> = ({
  expense,
  onClose,
  onUpdate,
  onDeleteRequest,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = getActiveCategories();

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.date);
      setNote(expense.note || '');
      setError(null);
    }
  }, [expense]);

  if (!expense) {
    return (
      <aside className="w-80 shrink-0 bg-[#F7F8F7] dark:bg-[#16161A] border-l border-[#E6E8E6] dark:border-white/10 hidden lg:flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#202028] border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-[#9A9AA2] shadow-2xs mb-3">
          <Receipt size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-[#F5F5F5]">Transaction Detail</h3>
        <p className="text-xs text-slate-500 dark:text-[#9A9AA2] mt-1 max-w-[200px]">
          Click any transaction row to view, update, or delete its details.
        </p>
      </aside>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than ₹0.00.');
      return;
    }
    if (!category) {
      setError('Category selection is mandatory.');
      return;
    }
    if (!date || isNaN(new Date(date + 'T00:00:00').getTime())) {
      setError('Please select a valid transaction date.');
      return;
    }

    setIsSaving(true);
    try {
      const success = await onUpdate(expense.id, {
        amount: parsedAmount,
        category,
        date,
        note,
      });

      if (!success) {
        setError('Failed to update expense details.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside className="w-80 shrink-0 bg-[#F7F8F7] dark:bg-[#16161A] border-l border-[#E6E8E6] dark:border-white/10 flex flex-col justify-between h-full p-5 overflow-y-auto animate-fade-in select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#9A9AA2]">
              Details
            </span>
            <CategoryBadge category={expense.category} size="sm" showEmoji={true} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 dark:text-[#9A9AA2] hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Note */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#9A9AA2] mb-1">
              Note / Description <span className="text-slate-400 dark:text-[#9A9AA2]">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Add expense note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-lg light-input text-xs text-slate-900 dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#9A9AA2] focus:outline-none resize-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#9A9AA2] mb-1">
              Amount (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-2.5 text-slate-400 dark:text-[#9A9AA2]" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 rounded-lg light-input text-sm font-bold text-slate-900 dark:text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#9A9AA2] mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 rounded-lg light-input text-xs font-semibold text-slate-800 dark:text-[#F5F5F5] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#9A9AA2] mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-2.5 text-slate-400 dark:text-[#9A9AA2]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-1.5 rounded-lg light-input text-xs font-medium text-slate-800 dark:text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-[#E6E8E6] dark:border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDeleteRequest(expense)}
            className="w-1/2 py-2.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-white/10 bg-white dark:bg-[#202028] text-slate-700 dark:text-[#F5F5F5] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-all shadow-2xs"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-1/2 py-2.5 rounded-lg text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 transition-all shadow-2xs active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </aside>
  );
};
