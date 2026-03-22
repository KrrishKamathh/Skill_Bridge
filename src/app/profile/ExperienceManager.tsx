"use client";

import { useState } from "react";

export interface Experience {
  id?: string;
  company: string;
  position: string;
  duration: string;
  description?: string;
}

interface ExperienceManagerProps {
  initialExperience: Experience[];
  onChange: (exp: Experience[]) => void;
}

export default function ExperienceManager({ initialExperience, onChange }: ExperienceManagerProps) {
  const [expList, setExpList] = useState<Experience[]>(initialExperience);
  const [newExp, setNewExp] = useState<Omit<Experience, 'id'>>({
    company: "",
    position: "",
    duration: "",
    description: ""
  });

  const addExperience = () => {
    if (newExp.company && newExp.position) {
      const updated = [...expList, { ...newExp }];
      setExpList(updated);
      onChange(updated);
      setNewExp({ company: "", position: "", duration: "", description: "" });
    }
  };

  const removeExperience = (index: number) => {
    const updated = expList.filter((_, i) => i !== index);
    setExpList(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-300">Professional Experience</label>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Career History</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {expList.map((exp, index) => (
          <div key={index} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><rect width="20" height="12" x="2" y="7" rx="2"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{exp.position}</h4>
                <p className="text-xs text-slate-400 font-medium">{exp.company} • {exp.duration}</p>
                {exp.description && <p className="text-[11px] text-slate-500 mt-2 leading-relaxed max-w-lg">{exp.description}</p>}
              </div>
            </div>
            <button 
              type="button"
              onClick={() => removeExperience(index)}
              className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Company Name"
            value={newExp.company}
            onChange={(e) => setNewExp({...newExp, company: e.target.value})}
            className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
          <input 
            type="text" 
            placeholder="Position"
            value={newExp.position}
            onChange={(e) => setNewExp({...newExp, position: e.target.value})}
            className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Duration (e.g., June 2022 - Present)"
            value={newExp.duration}
            onChange={(e) => setNewExp({...newExp, duration: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
          <textarea 
            placeholder="Description of responsibilities and achievements..."
            value={newExp.description}
            onChange={(e) => setNewExp({...newExp, description: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium resize-none"
            rows={2}
          />
          <button 
            type="button"
            onClick={addExperience}
            disabled={!newExp.company || !newExp.position}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black rounded-2xl px-8 py-3.5 shadow-2xl shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-widest"
          >
            Add Experience
          </button>
        </div>
      </div>
    </div>
  );
}
