'use client';

import React from 'react';
import { ExpenseFilter, Expense } from '@/lib/types';
import { getActiveCategories } from '@/lib/constants';
import { exportExpensesToCSV } from '@/lib/exportUtils';
import { Search, Filter, X, RefreshCw, Download } from 'lucide-react';

interface ExpenseFiltersProps {
  filter: ExpenseFilter;
  onFilterChange: (updated: ExpenseFilter) => void;
  onReset: () => void;
  totalFilteredCount: number;
  filteredExpenses?: Expense[];
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filter,
  onFilterChange,
  onReset,
  totalFilteredCount,
  filteredExpenses = [],
}) => {
  const categories = getActiveCategories();

  const handleQuickRange = (range: ExpenseFilter['quickRange']) => {
    const now = new Date();
    let startDate = '';
    let endDate = '';

    if (range === 'THIS_MONTH') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startDate = start.toISOString().slice(0, 10);
      endDate = end.toISOString().slice(0, 10);
    } else if (range === 'LAST_MONTH') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      startDate = start.toISOString().slice(0, 10);
      endDate = end.toISOString().slice(0, 10);
    } else if (range === 'THIS_YEAR') {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      startDate = start.toISOString().slice(0, 10);
      endDate = end.toISOString().slice(0, 10);
    }

    onFilterChange({
      ...filter,
      quickRange: range,
      startDate,
      endDate,
    });
  };

  const hasActiveFilters =
    filter.category !== 'ALL' ||
    filter.startDate !== '' ||
    filter.endDate !== '' ||
    filter.search !== '';

  return (
    <div className="app-card p-4 space-y-4 mb-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-700 dark:text-[#F5F5F5]" />
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-[#F5F5F5]">
            Filter Transactions
          </h2>
          <span className="ml-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-[#202028] text-slate-700 dark:text-[#9A9AA2] border border-slate-200 dark:border-white/10">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Quick Presets & Export CSV Button */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Time' },
            { id: 'THIS_MONTH', label: 'This Month' },
            { id: 'LAST_MONTH', label: 'Last Month' },
            { id: 'THIS_YEAR', label: 'This Year' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleQuickRange(preset.id as ExpenseFilter['quickRange'])}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter.quickRange === preset.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xs'
                  : 'bg-slate-100 dark:bg-[#16161C] text-slate-600 dark:text-[#9A9AA2] hover:bg-slate-200/60 dark:hover:bg-[#202028] hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-100 transition-colors ml-1"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={() => exportExpensesToCSV(filteredExpenses)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 transition-colors ml-2 shadow-2xs"
            title="Export monthly report as CSV / Excel file"
          >
            <Download size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 dark:text-[#9A9AA2] uppercase tracking-wider mb-1">
            Search Keyword
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 dark:text-[#9A9AA2]" />
            <input
              type="text"
              placeholder="Search notes or category..."
              value={filter.search}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg light-input text-xs text-slate-900 dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#9A9AA2]"
            />
            {filter.search && (
              <button
                onClick={() => onFilterChange({ ...filter, search: '' })}
                className="absolute right-2.5 top-2 text-slate-400 dark:text-[#9A9AA2] hover:text-slate-700 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 dark:text-[#9A9AA2] uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg light-input text-xs font-medium text-slate-800 dark:text-[#F5F5F5]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 dark:text-[#9A9AA2] uppercase tracking-wider mb-1">
            Date Range (From - To)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  quickRange: 'CUSTOM',
                  startDate: e.target.value,
                })
              }
              className="w-full px-2 py-1.5 rounded-lg light-input text-xs font-medium text-slate-800 dark:text-[#F5F5F5]"
            />
            <span className="text-slate-400 dark:text-[#9A9AA2] text-xs">-</span>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  quickRange: 'CUSTOM',
                  endDate: e.target.value,
                })
              }
              className="w-full px-2 py-1.5 rounded-lg light-input text-xs font-medium text-slate-800 dark:text-[#F5F5F5]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
