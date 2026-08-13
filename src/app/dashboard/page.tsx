'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { DashboardWidgets } from '@/components/DashboardWidgets';
import { ExpenseDetailPanel } from '@/components/ExpenseDetailPanel';
import { ExpenseModal } from '@/components/ExpenseModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Toast, ToastMessage } from '@/components/Toast';
import { Expense, ExpenseFilter, ExpenseFormData, MonthlyStats } from '@/lib/types';
import { fetchExpenses, addExpense, updateExpense, deleteExpense, calculateMonthlyStats } from '@/lib/storage';
import { getMonthlyIncome } from '@/lib/constants';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<MonthlyStats>({
    totalSpendCurrentMonth: 0,
    totalSpendPreviousMonth: 0,
    percentageChange: 0,
    totalTransactionsCount: 0,
    topCategory: 'None',
    averageDailySpend: 0,
    monthlyBudget: getMonthlyIncome(),
    availableBalance: getMonthlyIncome(),
    categoryBreakdown: [],
  });

  const [filter, setFilter] = useState<ExpenseFilter>({
    category: 'ALL',
    startDate: '',
    endDate: '',
    search: '',
    quickRange: 'ALL',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { expenses: data } = await fetchExpenses(filter);
      setExpenses(data);
      const computedStats = calculateMonthlyStats(data, new Date(), getMonthlyIncome());
      setStats(computedStats);

      if (selectedExpense) {
        const found = data.find((e) => e.id === selectedExpense.id);
        setSelectedExpense(found || null);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, selectedExpense]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSaveExpense = async (formData: ExpenseFormData, id?: string): Promise<boolean> => {
    let res;
    if (id) {
      res = await updateExpense(id, formData);
    } else {
      res = await addExpense(formData);
    }

    if (res.success) {
      setToast({
        id: Date.now().toString(),
        type: 'success',
        text: id ? 'Expense updated successfully!' : 'New expense added successfully!',
      });
      await loadDashboardData();
      return true;
    } else {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        text: res.error || 'Failed to save expense.',
      });
      return false;
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    const res = await deleteExpense(id);
    if (res.success) {
      setToast({
        id: Date.now().toString(),
        type: 'success',
        text: 'Expense deleted successfully.',
      });
      if (selectedExpense?.id === id) {
        setSelectedExpense(null);
      }
      await loadDashboardData();
    } else {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        text: res.error || 'Failed to delete expense.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-900 p-2 sm:p-4 lg:p-5 flex items-center justify-center font-sans">
      <div className="max-w-[1500px] w-full h-[calc(100vh-2.5rem)] min-h-[650px] bg-white rounded-3xl border border-[#E2E8E2] shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden md:block h-full">
          <Sidebar
            expensesCount={expenses.length}
            selectedCategory={filter.category}
            onSelectCategory={(cat) => setFilter({ ...filter, category: cat })}
            searchTerm={filter.search}
            onSearchChange={(search) => setFilter({ ...filter, search })}
          />
        </div>

        {/* Mobile Header */}
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* Center Main Dashboard Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-white">
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
              <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
            </div>
          ) : (
            <DashboardWidgets
              stats={stats}
              recentExpenses={expenses}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSelectExpense={(item) => setSelectedExpense(item)}
              selectedExpenseId={selectedExpense?.id}
              onRefreshDashboard={loadDashboardData}
            />
          )}
        </main>

        {/* Right Detail Panel */}
        <ExpenseDetailPanel
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onUpdate={(id, formData) => handleSaveExpense(formData, id)}
          onDeleteRequest={(exp) => {
            setExpenseToDelete(exp);
            setIsDeleteModalOpen(true);
          }}
          availableBalance={stats.availableBalance}
        />
      </div>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
        availableBalance={stats.availableBalance}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        expense={expenseToDelete}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
