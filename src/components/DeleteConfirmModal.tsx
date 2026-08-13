'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/constants';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  expense: Expense | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  expense,
}) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E24] text-[#F5F5F5] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle size={18} />
            <h3 className="text-base font-extrabold text-[#F5F5F5]">Confirm Deletion</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#9A9AA2] hover:text-[#F5F5F5] hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#9A9AA2] font-medium leading-relaxed">
            Are you sure you want to permanently delete this expense transaction? This action cannot be undone.
          </p>

          <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/10 space-y-1 text-xs">
            <div className="flex items-center justify-between font-extrabold text-[#F5F5F5]">
              <span>{expense.category}</span>
              <span className="text-rose-400">{formatCurrency(expense.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#9A9AA2]">
              <span className="truncate max-w-[200px]">{expense.note || 'No description'}</span>
              <span>{formatDate(expense.date)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9A9AA2] hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(expense.id);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-all"
            >
              Delete Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
