'use client';

import React, { useState, useEffect } from 'react';
import { X, Wallet, IndianRupee, AlertCircle } from 'lucide-react';
import { getMonthlyIncome, setMonthlyIncome } from '@/lib/constants';

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncomeUpdated: () => void;
}

export const EditIncomeModal: React.FC<EditIncomeModalProps> = ({
  isOpen,
  onClose,
  onIncomeUpdated,
}) => {
  const [income, setIncome] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getMonthlyIncome();
      setIncome(current.toString());
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(income);
    if (isNaN(parsed) || parsed < 0) {
      setError('Total income must be a valid amount (₹0.00 or higher).');
      return;
    }

    setMonthlyIncome(parsed);
    onIncomeUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E24] text-[#F5F5F5] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <div className="flex items-center gap-2 text-emerald-400">
            <Wallet className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-[#F5F5F5]">Configure Total Income</h3>
          </div>
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

          <p className="text-xs text-[#9A9AA2]">
            Set your monthly total income budget to accurately track your remaining balance and spending percentages.
          </p>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Monthly Total Income (₹ INR) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={18} className="absolute left-3.5 top-3 text-[#9A9AA2]" />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl light-input text-[#F5F5F5] font-extrabold text-lg focus:outline-none"
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all"
            >
              <span>Save Income</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
