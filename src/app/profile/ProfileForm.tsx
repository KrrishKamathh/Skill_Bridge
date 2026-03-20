"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setStatus('success');
      router.refresh(); // Automatically refresh the server component to fetch new data
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="name">Display Name</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-sm px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>

        {status === 'success' && <span className="text-green-400 text-sm font-medium flex items-center gap-1 animate-fade-in-up">✓ Profile saved!</span>}
        {status === 'error' && <span className="text-red-400 text-sm font-medium flex items-center gap-1 animate-fade-in-up">✗ Failed to save.</span>}
      </div>
    </form>
  );
}
