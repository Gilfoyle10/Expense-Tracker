'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/lib/types';
import { EXPENSE_CATEGORIES, getActiveCategories } from '@/lib/constants';
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
      <aside className="w-80 shrink-0 bg-[#F7F8F7] border-l border-[#E6E8E6] hidden lg:flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-400 shadow-2xs mb-3">
          <Receipt size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Transaction Detail</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
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
    <aside className="w-80 shrink-0 bg-[#F7F8F7] border-l border-[#E6E8E6] flex flex-col justify-between h-full p-5 overflow-y-auto animate-fade-in select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Details
            </span>
            <CategoryBadge category={expense.category} size="sm" showEmoji={true} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Note */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Note / Description <span className="text-slate-400">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Add expense note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E2E4E2] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs resize-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Amount (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E2E4E2] text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E4E2] text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-400 shadow-2xs"
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
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E2E4E2] text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 shadow-2xs"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-[#E6E8E6] space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDeleteRequest(expense)}
            className="w-1/2 py-2.5 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all shadow-2xs"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-1/2 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 transition-all shadow-2xs active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </aside>
  );
};
