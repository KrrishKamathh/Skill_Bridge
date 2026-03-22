"use client";

import { useState } from "react";

interface AchievementManagerProps {
  initialAchievements: string[];
  onChange: (achievements: string[]) => void;
}

export default function AchievementManager({ initialAchievements, onChange }: AchievementManagerProps) {
  const [achievements, setAchievements] = useState<string[]>(initialAchievements || []);
  const [newAchievement, setNewAchievement] = useState("");

  const addAchievement = () => {
    if (newAchievement && !achievements.includes(newAchievement)) {
      const updated = [...achievements, newAchievement];
      setAchievements(updated);
      onChange(updated);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-300">Awards & Achievements</label>
        <span className="text-[10px] uppercase tracking-wider text-green-500 font-extrabold">Stand Out</span>
      </div>

      <div className="space-y-3">
        {achievements.map((ach, index) => (
          <div key={index} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
              </div>
              <p className="text-xs text-white font-medium">{ach}</p>
            </div>
            <button 
              type="button"
              onClick={() => removeAchievement(index)}
              className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. Winner of 24h Global Hackathon"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
            className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/20 font-medium"
          />
          <button 
            type="button"
            onClick={addAchievement}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold text-xs"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
