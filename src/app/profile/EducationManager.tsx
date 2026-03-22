"use client";

import { useState } from "react";

export interface Education {
  id?: string;
  school: string;
  degree: string;
  year: string;
  gpa?: string;
}

interface EducationManagerProps {
  initialEducation: Education[];
  onChange: (edu: Education[]) => void;
}

export default function EducationManager({ initialEducation, onChange }: EducationManagerProps) {
  const [eduList, setEduList] = useState<Education[]>(initialEducation);
  const [newEdu, setNewEdu] = useState<Omit<Education, 'id'>>({
    school: "",
    degree: "",
    year: "",
    gpa: ""
  });

  const addEducation = () => {
    if (newEdu.school && newEdu.degree) {
      const updated = [...eduList, { ...newEdu }];
      setEduList(updated);
      onChange(updated);
      setNewEdu({ school: "", degree: "", year: "", gpa: "" });
    }
  };

  const removeEducation = (index: number) => {
    const updated = eduList.filter((_, i) => i !== index);
    setEduList(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-300">Academic Background</label>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Educational History</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {eduList.map((edu, index) => (
          <div key={index} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{edu.school}</h4>
                <p className="text-xs text-slate-400 font-medium">{edu.degree} • Class of {edu.year}</p>
                {edu.gpa && <p className="text-[10px] text-indigo-400 font-black mt-1 uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit">GPA: {edu.gpa}</p>}
              </div>
            </div>
            <button 
              type="button"
              onClick={() => removeEducation(index)}
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
            placeholder="Institution Name"
            value={newEdu.school}
            onChange={(e) => setNewEdu({...newEdu, school: e.target.value})}
            className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
          <input 
            type="text" 
            placeholder="Degree / Major"
            value={newEdu.degree}
            onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})}
            className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Graduation Year"
            value={newEdu.year}
            onChange={(e) => setNewEdu({...newEdu, year: e.target.value})}
            className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
          <input 
            type="text" 
            placeholder="GPA (Optional)"
            value={newEdu.gpa}
            onChange={(e) => setNewEdu({...newEdu, gpa: e.target.value})}
            className="w-32 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-center"
          />
          <button 
            type="button"
            onClick={addEducation}
            disabled={!newEdu.school || !newEdu.degree}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black rounded-2xl px-8 py-3.5 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 uppercase tracking-widest"
          >
            Add Edu
          </button>
        </div>
      </div>
    </div>
  );
}
