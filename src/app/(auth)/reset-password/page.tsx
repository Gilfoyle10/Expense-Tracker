'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Wallet, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!configured) {
      setTimeout(() => {
        setMessage('Password reset instructions sent! Check your inbox.');
      }, 400);
      return;
    }

    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('Check your email for the password reset link.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset request.');
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
          <h1 className="text-2xl font-black text-[#F5F5F5] tracking-tight">Reset Password</h1>
          <p className="text-xs text-[#9A9AA2] font-medium">Enter your email to receive password recovery link</p>
        </div>

        <div className="app-card p-6 sm:p-8 space-y-5 bg-[#1E1E24] border border-white/10">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1">
                Registered Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Sending Request...' : 'Send Reset Link'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#9A9AA2] pt-2 border-t border-white/10">
            <Link href="/login" className="inline-flex items-center gap-1 font-extrabold text-[#F5F5F5] hover:underline">
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
