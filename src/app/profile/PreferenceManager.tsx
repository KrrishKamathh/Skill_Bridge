"use client";

import { useState } from "react";

interface Preferences {
  desiredRoles: string[];
  expectedSalary: string;
  workStyle: "REMOTE" | "ONSITE" | "HYBRID" | "ANY";
}

interface PreferenceManagerProps {
  initialPreferences: Preferences | null;
  onChange: (prefs: Preferences) => void;
}

export default function PreferenceManager({ initialPreferences, onChange }: PreferenceManagerProps) {
  const [prefs, setPrefs] = useState<Preferences>(initialPreferences || {
    desiredRoles: [],
    expectedSalary: "",
    workStyle: "ANY"
  });

  const [newRole, setNewRole] = useState("");

  const updatePrefs = (newFields: Partial<Preferences>) => {
    const updated = { ...prefs, ...newFields };
    setPrefs(updated);
    onChange(updated);
  };

  const addRole = () => {
    if (newRole && !prefs.desiredRoles.includes(newRole)) {
      updatePrefs({ desiredRoles: [...prefs.desiredRoles, newRole] });
      setNewRole("");
    }
  };

  const removeRole = (role: string) => {
    updatePrefs({ desiredRoles: prefs.desiredRoles.filter(r => r !== role) });
  };

  return (
    <div className="space-y-8 bg-white/[0.02] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-black text-white">Job Preferences</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Define Your Ideal Next Role</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Desired Roles</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Frontend Developer"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
              className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 font-medium"
            />
            <button 
              type="button"
              onClick={addRole}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold text-xs"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {prefs.desiredRoles.map((role, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold flex items-center gap-2 animate-in zoom-in-50">
                {role}
                <button type="button" onClick={() => removeRole(role)} className="hover:text-white transition-colors">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Work Style</label>
            <div className="grid grid-cols-2 gap-2">
              {["REMOTE", "ONSITE", "HYBRID", "ANY"].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => updatePrefs({ workStyle: style as any })}
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all border uppercase ${
                    prefs.workStyle === style 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-600/20' 
                      : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Expected Salary (Annual)</label>
            <input 
              type="text" 
              placeholder="e.g. $80,000 - $100,000"
              value={prefs.expectedSalary}
              onChange={(e) => updatePrefs({ expectedSalary: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
