'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('expense_tracker_theme');
    // Default to dark theme unless explicitly set to light
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('expense_tracker_theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('expense_tracker_theme', 'light');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('expense_tracker_theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 dark:border-slate-700 bg-slate-800 dark:bg-slate-800 text-slate-200 dark:text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-all shadow-2xs select-none"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} className="text-amber-400 shrink-0" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-indigo-400 shrink-0" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
};
