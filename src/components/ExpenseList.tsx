'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/constants';
import { CategoryBadge } from './CategoryBadge';
import { Edit2, Trash2, Receipt, PlusCircle, ChevronRight, CheckSquare } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAddNew: () => void;
  onSelectExpense?: (expense: Expense) => void;
  selectedExpenseId?: string | null;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  isLoading,
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
          <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="w-32 h-4 rounded bg-slate-100" />
                <div className="w-20 h-3 rounded bg-slate-100" />
              </div>
            </div>
            <div className="w-24 h-6 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="app-card p-12 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Receipt size={28} />
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-base font-bold text-slate-900">No expenses found</h3>
          <p className="text-xs text-slate-500 font-medium">
            There are no recorded expenses matching your current filters.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all"
        >
          <PlusCircle size={16} />
          <span>Add New Expense</span>
        </button>
      </div>
    );
  }

  return (
    <div className="app-card overflow-hidden">
      {/* Desktop List View matching Reference Image Row Format */}
      <div className="hidden sm:block">
        <div className="divide-y divide-slate-100">
          {expenses.map((item) => {
            const isSelected = selectedExpenseId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectExpense && onSelectExpense(item)}
                className={`flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all group ${
                  isSelected
                    ? 'bg-slate-100/80 font-semibold'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left Side: Checkbox Icon + Note / Category */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-slate-400 shrink-0">
                    <CheckSquare size={12} className={isSelected ? 'text-slate-900' : 'opacity-0 group-hover:opacity-100'} />
                  </div>

                  <div className="flex flex-col min-w-0 space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.note ? item.note : item.category}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Category Badge Pill */}
                <div className="hidden md:block">
                  <CategoryBadge category={item.category} size="sm" />
                </div>

                {/* Right Side: Amount + Actions + Chevron Arrow > */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(item.amount)}
                  </span>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                      title="Edit expense"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Right Chevron Arrow > matching reference image */}
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-slate-100">
        {expenses.map((item) => {
          const isSelected = selectedExpenseId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectExpense && onSelectExpense(item)}
              className={`p-4 space-y-2 cursor-pointer ${
                isSelected ? 'bg-slate-100/80' : 'active:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <CategoryBadge category={item.category} size="sm" />
                <span className="text-sm font-black text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              {item.note && (
                <p className="text-xs text-slate-700 font-medium">
                  {item.note}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                <span>{formatDate(item.date)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="text-slate-600 font-medium px-2 py-0.5 rounded bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    className="text-rose-600 font-medium px-2 py-0.5 rounded bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
