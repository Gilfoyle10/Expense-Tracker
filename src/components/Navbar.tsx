'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface NavbarProps {
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const configured = isSupabaseConfigured();

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
    { label: 'Expenses', href: '/expenses', icon: Receipt },
  ];

  return (
    <nav className="md:hidden sticky top-0 z-40 w-full bg-[#F7F8F7] dark:bg-slate-900 border-b border-[#E6E8E6] dark:border-slate-800 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
            <Wallet size={16} />
          </div>
          <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
            ExpenseTrack
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded-xl bg-[#FFC72C] text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-2xs"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="pt-3 pb-2 space-y-2 border-t border-[#E6E8E6] dark:border-slate-800 mt-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};
