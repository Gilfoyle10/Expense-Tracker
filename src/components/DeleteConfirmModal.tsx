'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/constants';
import { AlertTriangle, Trash2 } from 'lucide-react';

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
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen || !expense) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(expense.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">Delete Expense Record?</h3>
            <p className="text-xs text-slate-500 mt-1">
              This action cannot be undone. Are you sure you want to permanently delete this expense?
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
              <span>{expense.category}</span>
              <span className="text-rose-600 font-extrabold">{formatCurrency(expense.amount)}</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>{formatDate(expense.date)}</span>
              {expense.note && <span className="truncate max-w-[180px] text-slate-600">{expense.note}</span>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-all disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>{isDeleting ? 'Deleting...' : 'Delete Expense'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
