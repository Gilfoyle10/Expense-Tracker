'use client';

import React, { useState, useEffect } from 'react';
import { X, IndianRupee, Wallet, Check, AlertCircle } from 'lucide-react';
import { getMonthlyIncome, setMonthlyIncome } from '@/lib/constants';

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncomeUpdated: (newIncome: number) => void;
}

export const EditIncomeModal: React.FC<EditIncomeModalProps> = ({
  isOpen,
  onClose,
  onIncomeUpdated,
}) => {
  const [incomeInput, setIncomeInput] = useState<string>('50000');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getMonthlyIncome();
      setIncomeInput(current.toString());
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(incomeInput);
    if (isNaN(val) || val < 0) {
      setError('Please enter a valid monthly income amount (≥ ₹0.00).');
      return;
    }

    setMonthlyIncome(val);
    onIncomeUpdated(val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Configure Total Income</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              Monthly Total Income (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="number"
                step="500"
                min="0"
                placeholder="50000"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl light-input text-slate-900 font-extrabold text-lg focus:border-slate-900 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
              This sets your total monthly income budget used to calculate remaining balance & budget alerts.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all"
            >
              <Check size={16} />
              <span>Save Income</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
