# 💰 ExpenseTrack — Modern Minimal Expense Tracker Web App

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com/)

**ExpenseTrack** is a modern, high-performance personal expense tracking web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Supabase (PostgreSQL & Auth)**.

---

## ✨ Core Features

- **🎨 Modern Dark Productivity Aesthetic**: Deep charcoal (`#121212`) canvas with high-contrast WCAG AA compliant typography (`#F5F5F5` primary, `#9CA3AF` secondary).
- **🔒 Strict User Data Isolation**: Powered by PostgreSQL **Row-Level Security (RLS)** (`auth.uid() = user_id`) and user-scoped storage key mapping.
- **✨ Zero Data Initialization**: Every new user starts with ₹0.00 spend, ₹0.00 total income, and 0 transaction items. Demo data is never shown to new users.
- **💳 Configurable Total Income & Negative Balance Support**: Set your monthly income budget. Expenses exceeding income are recorded normally with a red negative remaining balance (`-₹15,000.00`).
- **🏷️ Indian Categories & Custom Creation**: 15+ predefined Indian categories + custom category creation with emojis + category deletion.
- **📊 CSV Monthly Report Export**: One-click browser download of transactions as `.csv` files for Excel/Google Sheets.
- **⚡ Real-Time Filtering & Search**: Keyword search, date range filters (This Month, Last Month, This Year, Custom Range), and category pills.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide React icons.
- **Backend & Database**: Supabase Cloud, PostgreSQL Database, Row-Level Security (RLS), Supabase Auth (Bcrypt).
- **Hosting & CI/CD**: Vercel Serverless Hosting, GitHub Actions CI/CD pipeline.

---

## 🚀 Local Setup & Execution Guide

### Prerequisites
- Node.js `v18.17.0` or higher
- npm `v9.x` or higher
- Git

### Step-by-Step Launch

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/expense-tracker.git
   cd expense-tracker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *(If left blank, the app safely runs in Local Browser Demo Mode).*

4. **Setup Database SQL Schema**:
   Run the following script in **[Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)**:
   ```sql
   CREATE TABLE IF NOT EXISTS public.expenses (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
       amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
       category TEXT NOT NULL,
       date DATE NOT NULL DEFAULT CURRENT_DATE,
       note TEXT,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);
   ```

5. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⚠️ Known Limitations & Storage Scoping

1. **Browser LocalStorage Scope**:
   - Offline LocalStorage demo data is stored per browser/device. Cloud multi-device synchronization requires connected Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) on Vercel.
2. **Supabase Auth Email Confirm Toggle**:
   - In Supabase development mode, if *"Confirm email"* is enabled under Auth Providers, new user signups require email link confirmation before first sign-in.
3. **Next.js Middleware Proxy Warning**:
   - Terminal outputs a minor Next.js 16 deprecation notice for middleware conventions, which does not impact production execution.
