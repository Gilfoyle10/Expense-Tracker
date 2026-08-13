'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseDetailPanel } from '@/components/ExpenseDetailPanel';
import { ExpenseModal } from '@/components/ExpenseModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Toast, ToastMessage } from '@/components/Toast';
import { Expense, ExpenseFilter, ExpenseFormData, MonthlyStats } from '@/lib/types';
import { fetchExpenses, addExpense, updateExpense, deleteExpense, calculateMonthlyStats } from '@/lib/storage';
import { exportExpensesToCSV } from '@/lib/exportUtils';
import { formatCurrency } from '@/lib/constants';
import { Plus, Download } from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<MonthlyStats>({
    totalSpendCurrentMonth: 0,
    totalSpendPreviousMonth: 0,
    percentageChange: 0,
    totalTransactionsCount: 0,
    topCategory: 'None',
    averageDailySpend: 0,
    monthlyBudget: 0,
    availableBalance: 0,
    categoryBreakdown: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ExpenseFilter>({
    category: 'ALL',
    startDate: '',
    endDate: '',
    search: '',
    quickRange: 'ALL',
  });

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { expenses: data } = await fetchExpenses(filter);
      setExpenses(data);
      const computedStats = calculateMonthlyStats(data);
      setStats(computedStats);

      if (selectedExpense) {
        const found = data.find((e) => e.id === selectedExpense.id);
        setSelectedExpense(found || null);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, selectedExpense]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleResetFilters = () => {
    setFilter({
      category: 'ALL',
      startDate: '',
      endDate: '',
      search: '',
      quickRange: 'ALL',
    });
  };

  const handleOpenAdd = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Expense) => {
    setExpenseToEdit(item);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item: Expense) => {
    setExpenseToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (formData: ExpenseFormData, id?: string): Promise<boolean> => {
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
        text: id ? 'Expense updated successfully!' : 'Expense added successfully!',
      });
      await loadExpenses();
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
      await loadExpenses();
    } else {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        text: res.error || 'Failed to delete expense.',
      });
    }
  };

  const totalFilteredSum = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

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
        <Navbar onOpenAddModal={handleOpenAdd} />

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-white">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Transactions
              </h1>
              <span className="px-3 py-0.5 rounded-full text-sm font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                {expenses.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-right">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {formatCurrency(totalFilteredSum)}
                </span>
              </div>

              <button
                onClick={() => exportExpensesToCSV(expenses)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs"
                title="Export monthly report as CSV file"
              >
                <Download size={15} className="text-emerald-600" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={16} />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <ExpenseFilters
            filter={filter}
            onFilterChange={setFilter}
            onReset={handleResetFilters}
            totalFilteredCount={expenses.length}
            filteredExpenses={expenses}
          />

          {/* Expense List */}
          <ExpenseList
            expenses={expenses}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onAddNew={handleOpenAdd}
            onSelectExpense={(item) => setSelectedExpense(item)}
            selectedExpenseId={selectedExpense?.id}
          />
        </main>

        {/* Right Detail Panel */}
        <ExpenseDetailPanel
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onUpdate={(id, formData) => handleSave(formData, id)}
          onDeleteRequest={(exp) => {
            setExpenseToDelete(exp);
            setIsDeleteModalOpen(true);
          }}
          availableBalance={stats.availableBalance}
        />
      </div>

      {/* Add / Edit Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
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
