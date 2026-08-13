'use client';

import React, { useState } from 'react';
import { MonthlyStats, Expense } from '@/lib/types';
import { formatCurrency, getMonthName, CATEGORY_CONFIG, getCategoryConfig } from '@/lib/constants';
import { CategoryBadge } from './CategoryBadge';
import { EditIncomeModal } from './EditIncomeModal';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Zap,
  PieChart,
  Wallet,
  ArrowRight,
  Plus,
  ChevronRight,
  Pencil,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardWidgetsProps {
  stats: MonthlyStats;
  recentExpenses: Expense[];
  onOpenAddModal: () => void;
  onSelectExpense?: (expense: Expense) => void;
  selectedExpenseId?: string | null;
  onRefreshDashboard?: () => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  stats,
  recentExpenses,
  onOpenAddModal,
  onSelectExpense,
  selectedExpenseId,
  onRefreshDashboard,
}) => {
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);

  const isHigherThanLastMonth = stats.percentageChange > 0;
  const currentMonthName = getMonthName();

  const totalIncome = stats.monthlyBudget;
  const remainingBalance = stats.availableBalance;
  const isOverBudget = remainingBalance < 0;
  const overBudgetAmount = Math.abs(remainingBalance);

  const percentageUsed = totalIncome > 0 ? ((stats.totalSpendCurrentMonth / totalIncome) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <span className="px-3 py-0.5 rounded-full text-sm font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            {stats.totalTransactionsCount}
          </span>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            • {currentMonthName}
          </span>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Month Spend Card */}
        <div className="app-card p-5 app-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(stats.totalSpendCurrentMonth)}
            </h2>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {stats.totalSpendPreviousMonth > 0 ? (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  isHigherThanLastMonth
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isHigherThanLastMonth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(stats.percentageChange)}% vs last month</span>
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">Current Month</span>
            )}
          </div>
        </div>

        {/* Configurable Total Income & Remaining Balance Card */}
        <div className="app-card p-5 app-card-hover relative group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total Income
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditIncomeOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Configure monthly total income"
              >
                <Pencil size={14} />
              </button>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isOverBudget ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                <Wallet size={16} />
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <h2 className="text-2xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(totalIncome)}
            </h2>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium">
            {isOverBudget ? (
              <div className="flex items-center gap-1 text-rose-600 font-bold">
                <AlertTriangle size={13} className="shrink-0" />
                <span>Remaining: {formatCurrency(remainingBalance)} (Over budget by {formatCurrency(overBudgetAmount)})</span>
              </div>
            ) : (
              <div className="text-slate-500">
                <span>Remaining: <strong className="text-slate-700">{formatCurrency(remainingBalance)}</strong></span>
                {totalIncome > 0 && <span className="text-slate-400 ml-1">({percentageUsed}% spent)</span>}
              </div>
            )}
          </div>
        </div>

        {/* Top Category Card */}
        <div className="app-card p-5 app-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Top Category
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <PieChart size={16} />
            </div>
          </div>
          <div className="mt-2">
            {stats.topCategory !== 'None' ? (
              <CategoryBadge category={stats.topCategory} size="md" />
            ) : (
              <span className="text-sm font-semibold text-slate-400">No data</span>
            )}
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            Highest spend area
          </p>
        </div>

        {/* Average Daily Spend Card */}
        <div className="app-card p-5 app-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Avg. Daily Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Zap size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(stats.averageDailySpend)}
            </h2>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            Per day average
          </p>
        </div>
      </div>

      {/* Main Breakdown & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-2 app-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Expenses by Category</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {stats.categoryBreakdown.length} active
            </span>
          </div>

          {stats.categoryBreakdown.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              No category data recorded for {currentMonthName}.
            </div>
          ) : (
            <div className="space-y-3.5">
              {stats.categoryBreakdown.map((item) => {
                const config = getCategoryConfig(item.category);
                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={item.category} size="sm" />
                        <span className="text-slate-400 text-[11px]">
                          ({item.count} {item.count === 1 ? 'item' : 'items'})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[11px]">{item.percentage}%</span>
                        <span className="font-bold text-slate-900">{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${config.barColor} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="app-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
              <Link
                href="/expenses"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No recent transactions.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentExpenses.slice(0, 5).map((exp) => {
                  const isSelected = selectedExpenseId === exp.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => onSelectExpense && onSelectExpense(exp)}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-100/90 font-semibold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5 max-w-[140px]">
                        <CategoryBadge category={exp.category} size="sm" />
                        <p className="text-[11px] text-slate-600 truncate">
                          {exp.note ? exp.note : exp.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(exp.amount)}
                        </span>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/expenses"
              className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Expenses</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Income Modal */}
      <EditIncomeModal
        isOpen={isEditIncomeOpen}
        onClose={() => setIsEditIncomeOpen(false)}
        onIncomeUpdated={() => {
          if (onRefreshDashboard) onRefreshDashboard();
        }}
      />
    </div>
  );
};
