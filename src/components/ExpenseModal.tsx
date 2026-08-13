'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/lib/types';
import { getActiveCategories, getCategoryConfig } from '@/lib/constants';
import { X, IndianRupee, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseFormData, id?: string) => Promise<boolean>;
  expenseToEdit?: Expense | null;
  availableBalance?: number;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = getActiveCategories();

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
      setNote(expenseToEdit.note || '');
    } else {
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    }
    setError(null);
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const success = await onSave(
        {
          amount: parsedAmount,
          category,
          date,
          note,
        },
        expenseToEdit?.id
      );

      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E24] text-[#F5F5F5] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <h3 className="text-base font-extrabold text-[#F5F5F5]">
            {expenseToEdit ? 'Edit Expense Record' : 'Add New Expense'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#9A9AA2] hover:text-[#F5F5F5] hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Amount (₹ INR) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={18} className="absolute left-3.5 top-3 text-[#9A9AA2]" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl light-input text-[#F5F5F5] font-extrabold text-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Category <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = category === cat;
                const config = getCategoryConfig(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                      isSelected
                        ? 'bg-white border-white text-slate-950 shadow-2xs font-bold'
                        : 'bg-[#16161A] border-white/10 text-[#F5F5F5] hover:bg-[#202028]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs">{config.emoji}</span>
                      <span className="truncate text-[11px]">{cat}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={12} className="text-emerald-600 shrink-0 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Date <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-2.5 text-[#9A9AA2]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-xl light-input text-[#F5F5F5] font-medium text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Note / Description <span className="text-[#9A9AA2]">(Optional)</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute top-3 left-3.5 text-[#9A9AA2]" />
              <textarea
                rows={2}
                placeholder="e.g. Swiggy dinner order, DMart groceries..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl light-input text-[#F5F5F5] text-xs focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9A9AA2] hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : expenseToEdit ? 'Save changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
