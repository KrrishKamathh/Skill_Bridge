"use client";

import { useState } from "react";
import { Trophy, Plus, Trash2 } from "lucide-react";

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
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040]">Awards &amp; Accomplishments</label>
        <span className="text-[10px] uppercase tracking-widest text-[#2aa198] font-black">Merit Verified</span>
      </div>

      <div className="space-y-3">
        {achievements.map((ach, index) => (
          <div key={index} className="group flex items-center justify-between p-4 rounded-2xl bg-[#eee8d5]/40 border border-transparent hover:border-[#cfc3a0] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#cfc3a0] flex items-center justify-center text-[#b58900] shadow-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-sm text-[#2d2013] font-bold">{ach}</p>
            </div>
            <button 
              type="button"
              onClick={() => removeAchievement(index)}
              className="p-2 hover:bg-[#cb4b16]/10 rounded-xl text-[#b5a080] hover:text-[#cb4b16] opacity-0 group-hover:opacity-100 transition-all font-bold"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="flex gap-4 p-1 bg-[#eee8d5]/40 rounded-2xl border border-[#cfc3a0]/40">
          <input 
            type="text" 
            placeholder="e.g. Winner of 24h Global Hackathon"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
            className="flex-1 px-5 py-3.5 bg-transparent text-sm text-[#2d2013] focus:outline-none placeholder:text-[#b5a080] font-medium"
          />
          <button 
            type="button"
            onClick={addAchievement}
            className="px-4 py-2 bg-[#2d2013] text-[#fdf6e3] rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-[#cb4b16] transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
