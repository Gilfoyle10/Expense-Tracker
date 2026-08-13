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
      <aside className="w-80 shrink-0 bg-[#16161A] border-l border-white/10 hidden lg:flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-12 h-12 rounded-xl bg-[#202028] border border-white/10 flex items-center justify-center text-[#9CA3AF] shadow-2xs mb-3">
          <Receipt size={24} />
        </div>
        <h3 className="text-sm font-bold text-[#F5F5F5]">Transaction Detail</h3>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-[200px]">
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
    <aside className="w-80 shrink-0 bg-[#16161A] border-l border-white/10 flex flex-col justify-between h-full p-5 overflow-y-auto animate-fade-in select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF]">
              Details
            </span>
            <CategoryBadge category={expense.category} size="sm" showEmoji={true} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Note */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Note / Description <span className="text-[#9CA3AF]">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Add expense note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-lg light-input text-xs text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none resize-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Amount (₹ INR) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-2.5 text-[#9CA3AF]" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 rounded-lg light-input text-sm font-bold text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 rounded-lg light-input text-xs font-semibold text-[#F5F5F5] focus:outline-none"
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
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Date <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-2.5 text-[#9CA3AF]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-1.5 rounded-lg light-input text-xs font-medium text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDeleteRequest(expense)}
            className="w-1/2 py-2.5 rounded-lg text-xs font-bold border border-white/10 bg-[#202028] text-[#F5F5F5] hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/30 transition-all shadow-2xs"
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
