'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/constants';
import { CategoryBadge } from './CategoryBadge';
import { Edit2, Trash2, Receipt, Calendar, FileText, Plus } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAddNew: () => void;
  onSelectExpense?: (expense: Expense) => void;
  selectedExpenseId?: string | null;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  isLoading = false,
  onEdit,
  onDelete,
  onAddNew,
  onSelectExpense,
  selectedExpenseId,
}) => {
  if (isLoading) {
    return (
      <div className="app-card p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="app-card p-12 text-center space-y-4 select-none">
        <div className="w-12 h-12 rounded-xl bg-[#202028] border border-white/10 flex items-center justify-center text-[#9CA3AF] mx-auto shadow-2xs">
          <Receipt size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#F5F5F5]">No transactions found</h3>
          <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto font-medium">
            No expenses match your criteria. Add a new expense or clear filters.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>Add New Expense</span>
        </button>
      </div>
    );
  }

  return (
    <div className="app-card overflow-hidden select-none">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#16161C] text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Note / Description</th>
              <th className="py-3 px-5 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {expenses.map((item) => {
              const isSelected = selectedExpenseId === item.id;
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectExpense && onSelectExpense(item)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white/10 font-semibold'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-3.5 px-5 whitespace-nowrap text-[#9CA3AF] font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#9CA3AF]" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <CategoryBadge category={item.category} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-[#F5F5F5] font-medium max-w-xs truncate">
                    {item.note ? (
                      <div className="flex items-center gap-1.5">
                        <FileText size={13} className="text-[#9CA3AF] shrink-0" />
                        <span className="truncate">{item.note}</span>
                      </div>
                    ) : (
                      <span className="text-[#9CA3AF] italic">No description</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap font-black text-[#F5F5F5]">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden divide-y divide-white/5">
        {expenses.map((item) => {
          const isSelected = selectedExpenseId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectExpense && onSelectExpense(item)}
              className={`p-4 space-y-3 cursor-pointer ${
                isSelected ? 'bg-white/10' : 'active:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <CategoryBadge category={item.category} size="sm" />
                <span className="text-sm font-black text-[#F5F5F5]">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span className="truncate max-w-[200px]">
                  {item.note || 'No note'}
                </span>
                <span className="shrink-0">{formatDate(item.date)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
