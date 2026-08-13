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
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Expenses', href: '/expenses', icon: Receipt, count: expensesCount },
  ];

  return (
    <>
      <aside className="w-64 shrink-0 bg-[#16161A] border-r border-white/10 flex flex-col justify-between h-full p-4 select-none">
        <div className="space-y-5 overflow-y-auto">
          {/* Top App Logo */}
          <div className="flex items-center justify-between px-1 pt-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-white text-slate-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Wallet size={16} />
              </div>
              <span className="font-extrabold text-base tracking-tight text-[#F5F5F5]">
                ExpenseTrack
              </span>
            </Link>
          </div>

          {/* Search Bar Input */}
          <div className="relative px-1">
            <Search size={14} className="absolute left-3.5 top-2.5 text-[#9A9AA2]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#121212] border border-white/10 text-xs text-[#F5F5F5] placeholder-[#9A9AA2] focus:outline-none focus:border-white/20 transition-all"
            />
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <span className="block px-2 text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1">
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
                      ? 'bg-[#202028] text-[#F5F5F5] border border-white/10 font-bold'
                      : 'text-[#9A9AA2] hover:text-[#F5F5F5] hover:bg-[#202028]/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-[#F5F5F5]' : 'text-[#9A9AA2]'} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A2A35] text-[#F5F5F5]">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Categories Section */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2]">
                Categories
              </span>
              <div className="flex items-center gap-1">
                {selectedCategory !== 'ALL' && onSelectCategory && (
                  <button
                    onClick={() => onSelectCategory('ALL')}
                    className="text-[10px] font-bold text-blue-400 hover:underline mr-1"
                  >
                    All
                  </button>
                )}
                <button
                  onClick={() => setIsAddCatModalOpen(true)}
                  className="p-1 rounded-lg bg-[#202028] hover:bg-[#2A2A35] text-[#F5F5F5] transition-colors"
                  title="Add new category"
                >
                  <Plus size={13} />
                </button>
                <button
                  onClick={() => setIsDeleteCatModalOpen(true)}
                  className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
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
                        ? 'bg-[#202028] text-[#F5F5F5] border border-white/10 font-bold'
                        : 'text-[#9A9AA2] hover:text-[#F5F5F5] hover:bg-[#202028]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs shrink-0">{config.emoji}</span>
                      <span className="truncate text-[11px]">{cat}</span>
                    </div>
                    {isSelected && <ChevronRight size={14} className="text-[#9A9AA2] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          {!configured && (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 font-medium flex items-center gap-1.5">
              <Sparkles size={12} className="shrink-0 text-amber-400" />
              <span>Local Demo Mode</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#202028] border border-white/10 shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#2A2A35] flex items-center justify-center text-[#F5F5F5] font-bold text-xs shrink-0">
                <User size={14} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-[#F5F5F5] truncate">
                  {userEmail ? userEmail.split('@')[0] : 'Demo User'}
                </span>
                <span className="text-[10px] text-[#9A9AA2] truncate">
                  {userEmail || 'demo@expensetrack.app'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-[#9A9AA2] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
