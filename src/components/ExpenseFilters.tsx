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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#F5F5F5]" />
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#F5F5F5]">
            Filter Transactions
          </h2>
          <span className="ml-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#202028] text-[#9CA3AF] border border-white/10">
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
                  ? 'bg-white text-slate-950 shadow-2xs font-extrabold'
                  : 'bg-[#16161C] text-[#9CA3AF] hover:bg-[#202028] hover:text-[#F5F5F5] border border-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors ml-1"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={() => exportExpensesToCSV(filteredExpenses)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors ml-2 shadow-2xs"
            title="Export monthly report as CSV / Excel file"
          >
            <Download size={13} className="text-emerald-300" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider mb-1">
            Search Keyword
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search notes or category..."
              value={filter.search}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg light-input text-xs text-[#F5F5F5] placeholder-[#9CA3AF]"
            />
            {filter.search && (
              <button
                onClick={() => onFilterChange({ ...filter, search: '' })}
                className="absolute right-2.5 top-2 text-[#9CA3AF] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg light-input text-xs font-medium text-[#F5F5F5]"
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
          <label className="block text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider mb-1">
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
              className="w-full px-2 py-1.5 rounded-lg light-input text-xs font-medium text-[#F5F5F5]"
            />
            <span className="text-[#9CA3AF] text-xs">-</span>
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
              className="w-full px-2 py-1.5 rounded-lg light-input text-xs font-medium text-[#F5F5F5]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
