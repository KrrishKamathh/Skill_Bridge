"use client";

import { useState } from "react";

interface SkillManagerProps {
  initialSkills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillManager({ initialSkills, onChange }: SkillManagerProps) {
  const [skills, setSkills] = useState<string[]>(initialSkills || []);
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        const newSkills = [...skills, inputValue.trim()];
        setSkills(newSkills);
        onChange(newSkills);
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(newSkills);
    onChange(newSkills);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300">Skills & Expertise</label>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill) => (
          <span 
            key={skill} 
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-100 text-sm flex items-center gap-2 group animate-fade-in"
          >
            {skill}
            <button 
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-blue-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-slate-500 text-sm italic">No skills added yet. Type below and press Enter.</p>
        )}
      </div>

      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddSkill}
        placeholder="Add a skill (e.g. React, Python) and press Enter"
        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
      />
    </div>
  );
}
