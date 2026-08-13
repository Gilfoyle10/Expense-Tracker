'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Wallet, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    if (!configured) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 400);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        if (data.session) {
          router.push('/dashboard');
        } else {
          setSuccess('Account created! Check your email for confirmation.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Signup failed.');
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
          <h1 className="text-2xl font-black text-[#F5F5F5] tracking-tight">Create Account</h1>
          <p className="text-xs text-[#9A9AA2] font-medium">
            Start managing your private expenses in seconds
          </p>
        </div>

        <div className="app-card p-6 sm:p-8 space-y-5 bg-[#1E1E24] border border-white/10">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-2.5 text-[#9A9AA2]" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl light-input text-xs text-[#F5F5F5] placeholder-[#9A9AA2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-2.5 text-[#9A9AA2]" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl light-input text-xs text-[#F5F5F5] placeholder-[#9A9AA2]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all disabled:opacity-50"
            >
              <UserPlus size={14} />
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#9A9AA2] pt-2 border-t border-white/10">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-[#F5F5F5] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
