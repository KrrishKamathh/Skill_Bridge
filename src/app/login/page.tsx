"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("Attempting sign in for:", email);
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      console.log("SignIn response:", res);

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        setLoading(false);
      } else if (res?.ok) {
        console.log("Success! Redirecting...");
        router.push('/dashboard');
      } else {
        setError("An unexpected error occurred. Please check console.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("SignIn exception:", err);
      setError("Connection lost. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#cb4b16] to-[#b34000] flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 bg-[#fdf6e3] rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-[#2d2013]">SkillBridge</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-[#2d2013] mb-1.5">Welcome back</h1>
        <p className="text-[#7a6040] text-sm">Sign in to continue your learning journey</p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-3 mb-7 p-1 bg-[#eee8d5] rounded-xl border border-[#cfc3a0]">
        <button
          onClick={() => setRole('STUDENT')}
          className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
            role === 'STUDENT'
              ? 'bg-[#fdf6e3] text-[#cb4b16] shadow-sm border border-[#cfc3a0]'
              : 'text-[#7a6040] hover:text-[#2d2013]'
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setRole('RECRUITER')}
          className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
            role === 'RECRUITER'
              ? 'bg-[#fdf6e3] text-[#cb4b16] shadow-sm border border-[#cfc3a0]'
              : 'text-[#7a6040] hover:text-[#2d2013]'
          }`}
        >
          Recruiter
        </button>
      </div>

      {/* Alerts */}
      {registered && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 rounded-xl bg-[#2aa198]/10 border border-[#2aa198]/30 text-[#2aa198] text-sm text-center font-medium"
        >
          ✓ Account created successfully! Please sign in.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 rounded-xl bg-[#cb4b16]/10 border border-[#cb4b16]/30 text-[#cb4b16] text-sm text-center font-medium"
        >
          ✕ {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#2d2013] mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#fdf6e3] border border-[#cfc3a0] text-[#2d2013] placeholder:text-[#b5a080] focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30 focus:border-[#cb4b16] transition-all text-sm"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-[#2d2013]" htmlFor="password">
              Password
            </label>
            <a href="#" className="text-xs text-[#cb4b16] hover:text-[#b34000] font-medium transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#fdf6e3] border border-[#cfc3a0] text-[#2d2013] placeholder:text-[#b5a080] focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30 focus:border-[#cb4b16] transition-all text-sm pr-12"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a6040] hover:text-[#2d2013] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#2d2013] text-[#fdf6e3] font-bold text-sm transition-all hover:bg-[#4a3520] active:scale-[0.99] disabled:opacity-50 shadow-lg mt-2 tracking-wide"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#cfc3a0]" />
        <span className="text-xs text-[#b5a080] font-medium">or</span>
        <div className="flex-1 h-px bg-[#cfc3a0]" />
      </div>

      {/* Google SSO placeholder */}
      <button className="w-full py-3.5 rounded-xl bg-[#eee8d5] border border-[#cfc3a0] text-[#2d2013] font-semibold text-sm hover:bg-[#e5dcc5] transition-all flex items-center justify-center gap-3">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fdf6e3] flex flex-col justify-center items-center px-6 selection:bg-[#cb4b16]/20 relative">
      
      {/* Subtle ambient blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cb4b16]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-[#7a6040] hover:text-[#2d2013] transition-colors flex items-center gap-2 text-sm font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-[#cfc3a0] rounded-2xl p-8 sm:p-10 relative z-10 shadow-xl">
        <Suspense fallback={<div className="text-center text-[#7a6040]">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center border-t border-[#cfc3a0] pt-5">
          <p className="text-[#7a6040] text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#cb4b16] hover:text-[#b34000] font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
