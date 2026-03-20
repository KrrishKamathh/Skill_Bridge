"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      // Navigate to login after successful signup
      router.push('/login?registered=true');
    } else {
      const data = await res.json();
      setError(data.message || 'Error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-center items-center px-6 selection:bg-blue-500/30 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
        <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Create Account</h1>
          <p className="text-slate-400">Join SkillBridge today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="name">Full Name</label>
            <input 
              type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="John Doe" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">Email Address</label>
            <input 
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="you@example.com" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">Password</label>
            <input 
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="••••••••" required
            />
          </div>

          <button type="submit" className="w-full py-4 rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-[0.98] mt-4">
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
