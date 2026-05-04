"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase() || 'STUDENT';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-[#b58900]', 'bg-[#2aa198]'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      router.push('/login?registered=true');
    } else {
      const data = await res.json();
      setError(data.message || 'Something went wrong. Please try again.');
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
        <h1 className="text-3xl font-black tracking-tighter text-[#2d2013] mb-1.5">Create your account</h1>
        <p className="text-[#7a6040] text-sm">Start your learning journey today. Free forever.</p>
      </div>

      {/* Role Selector */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#2d2013] mb-2.5">I am a...</p>
        <div className="grid grid-cols-2 gap-3 p-1 bg-[#eee8d5] rounded-xl border border-[#cfc3a0]">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'STUDENT'
                ? 'bg-[#fdf6e3] text-[#cb4b16] shadow-sm border border-[#cfc3a0]'
                : 'text-[#7a6040] hover:text-[#2d2013]'
            }`}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'RECRUITER'
                ? 'bg-[#fdf6e3] text-[#cb4b16] shadow-sm border border-[#cfc3a0]'
                : 'text-[#7a6040] hover:text-[#2d2013]'
            }`}
          >
            💼 Recruiter
          </button>
        </div>
      </div>

      {/* Error */}
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2d2013] mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#fdf6e3] border border-[#cfc3a0] text-[#2d2013] placeholder:text-[#b5a080] focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30 focus:border-[#cb4b16] transition-all text-sm"
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

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
          <label className="block text-sm font-semibold text-[#2d2013] mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#fdf6e3] border border-[#cfc3a0] text-[#2d2013] placeholder:text-[#b5a080] focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30 focus:border-[#cb4b16] transition-all text-sm pr-12"
              placeholder="Min. 8 characters"
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
          {/* Password strength bar */}
          {password.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
              <div className="flex gap-1.5 mb-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-[#cfc3a0]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#7a6040]">
                Password strength: <span className="font-semibold">{strengthLabel[passwordStrength]}</span>
              </p>
            </motion.div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#2d2013] text-[#fdf6e3] font-bold text-sm transition-all hover:bg-[#4a3520] active:scale-[0.99] disabled:opacity-50 shadow-lg mt-2 tracking-wide"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : 'Create Account'}
        </button>
      </form>

      {/* Perks */}
      <div className="mt-5 space-y-2">
        {['Free to get started, no credit card', 'Access to all core learning paths', 'Join 10,000+ learners worldwide'].map((perk) => (
          <div key={perk} className="flex items-center gap-2 text-xs text-[#7a6040]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2aa198] shrink-0" />
            {perk}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#fdf6e3] flex flex-col justify-center items-center px-6 selection:bg-[#cb4b16]/20 relative py-12">

      {/* Ambient blob */}
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
          <SignupForm />
        </Suspense>

        <div className="mt-6 text-center border-t border-[#cfc3a0] pt-5">
          <p className="text-[#7a6040] text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-[#cb4b16] hover:text-[#b34000] font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
