'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Search,
  LogOut,
  User,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { getActiveCategories, getCategoryConfig } from '@/lib/constants';
import { ExpenseCategory } from '@/lib/types';
import { AddCategoryModal } from './AddCategoryModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';
import { ThemeToggle } from './ThemeToggle';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface SidebarProps {
  expensesCount?: number;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  expensesCount = 0,
  selectedCategory = 'ALL',
  onSelectCategory,
  onSearchChange,
  searchTerm = '',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isDeleteCatModalOpen, setIsDeleteCatModalOpen] = useState(false);
  const configured = isSupabaseConfigured();

  const loadCategories = useCallback(() => {
    setCategories(getActiveCategories());
  }, []);

  useEffect(() => {
    loadCategories();

    if (!configured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email || null);
        if (typeof window !== 'undefined') {
          localStorage.setItem('expense_tracker_active_session_user', data.user.id);
        }
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        if (typeof window !== 'undefined') {
          localStorage.setItem('expense_tracker_active_session_user', session.user.id);
        }
      } else {
        setUserEmail(null);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, [configured, loadCategories]);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('expense_tracker_active_session_user');
    }
    if (configured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Expenses', href: '/expenses', icon: Receipt, count: expensesCount },
  ];

  return (
    <>
      <aside className="w-64 shrink-0 bg-[#F7F8F7] dark:bg-slate-900 border-r border-[#E6E8E6] dark:border-slate-800 flex flex-col justify-between h-full p-4 select-none">
        <div className="space-y-5 overflow-y-auto">
          {/* Top App Logo & Theme Toggle */}
          <div className="flex items-center justify-between px-1 pt-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Wallet size={16} />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                ExpenseTrack
              </span>
            </Link>

            <ThemeToggle />
          </div>

          {/* Search Bar Input */}
          <div className="relative px-1">
            <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E2E4E2] dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 shadow-2xs transition-all"
            />
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <span className="block px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200/80 dark:border-slate-700 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Categories Section */}
          <div className="space-y-1 pt-2 border-t border-[#E6E8E6]/60 dark:border-slate-800">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </span>
              <div className="flex items-center gap-1">
                {selectedCategory !== 'ALL' && onSelectCategory && (
                  <button
                    onClick={() => onSelectCategory('ALL')}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline mr-1"
                  >
                    All
                  </button>
                )}
                <button
                  onClick={() => setIsAddCatModalOpen(true)}
                  className="p-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Add new category"
                >
                  <Plus size={13} />
                </button>
                <button
                  onClick={() => setIsDeleteCatModalOpen(true)}
                  className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="space-y-0.5 max-h-[280px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const config = getCategoryConfig(cat);
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'ALL' : cat)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200/80 dark:border-slate-700 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs shrink-0">{config.emoji}</span>
                      <span className="truncate text-[11px]">{cat}</span>
                    </div>
                    {isSelected && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="pt-3 border-t border-[#E6E8E6] dark:border-slate-800 space-y-2">
          {!configured && (
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[10px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5">
              <Sparkles size={12} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Local Demo Mode</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0">
                <User size={14} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {userEmail ? userEmail.split('@')[0] : 'Demo User'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {userEmail || 'demo@expensetrack.app'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Add Custom Category Modal */}
      <AddCategoryModal
        isOpen={isAddCatModalOpen}
        onClose={() => setIsAddCatModalOpen(false)}
        onCategoryAdded={(newCategory) => {
          loadCategories();
          if (onSelectCategory) {
            onSelectCategory(newCategory);
          }
        }}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteCatModalOpen}
        onClose={() => setIsDeleteCatModalOpen(false)}
        onCategoryDeleted={(deletedCategory) => {
          loadCategories();
          if (selectedCategory === deletedCategory && onSelectCategory) {
            onSelectCategory('ALL');
          }
        }}
      />
    </>
  );
};
