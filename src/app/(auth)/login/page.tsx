'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Wallet, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!configured) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 400);
      return;
    }

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212] text-[#F5F5F5] font-sans">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center space-y-1.5">
          <div className="inline-flex w-12 h-12 rounded-xl bg-white text-slate-950 items-center justify-center shadow-2xs mb-1">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#F5F5F5] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#9A9AA2] font-medium">
            Sign in to access your private expense dashboard
          </p>
        </div>

        <div className="app-card p-6 sm:p-8 space-y-5 bg-[#1E1E24] border border-white/10">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-2.5 text-[#9A9AA2]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl light-input text-xs text-[#F5F5F5] placeholder-[#9A9AA2]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2]">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-[11px] font-semibold text-blue-400 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-2.5 text-[#9A9AA2]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl light-input text-xs text-[#F5F5F5] placeholder-[#9A9AA2]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all disabled:opacity-50"
            >
              <LogIn size={14} />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#9A9AA2] pt-2 border-t border-white/10">
            Don't have an account?{' '}
            <Link href="/signup" className="font-extrabold text-[#F5F5F5] hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
