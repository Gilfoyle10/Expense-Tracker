'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  PieChart,
  Filter,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-900 flex flex-col font-sans relative overflow-hidden select-none">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full bg-[#F7F8F7] border-b border-[#E6E8E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-2xs">
              <Wallet size={16} />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              ExpenseTrack
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all"
            >
              <span>Launch App</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-col justify-center space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-bold">
            <Sparkles size={14} className="text-amber-600" />
            <span>Minimalist Light SaaS Dashboard</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Manage your expenses with spatial clarity
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Take full control of your personal spending. View monthly statistics, filter transactions by date & category, and manage your financial records in a clean 3-column layout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl text-xs font-bold bg-white border border-slate-200/80 text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
          <div className="app-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <PieChart size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Spending Overview</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Track current month totals, previous month comparisons, category percentage shares, and daily average spend.
            </p>
          </div>

          <div className="app-card p-6 space-y-3">
            <div className="w-12 w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Filter size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Interactive Filtering</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Filter by custom date ranges or category pills with live sum calculations.
            </p>
          </div>

          <div className="app-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Row-Level Security</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Supabase Auth and PostgreSQL Row Level Security ensure every user&apos;s financial data remains private.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E8E6] py-5 text-center text-xs text-slate-400 font-medium">
        ExpenseTrack Web Application MVP • Minimalist Light Design
      </footer>
    </div>
  );
}
