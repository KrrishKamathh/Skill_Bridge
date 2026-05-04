"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

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
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-[#cb4b16]" />
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040]">Skills &amp; Expertise</label>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <span 
            key={skill} 
            className="px-3 py-1.5 rounded-lg bg-[#eee8d5] border border-[#cfc3a0] text-[#2d2013] text-[10px] font-black uppercase tracking-wider flex items-center gap-2 group transition-all hover:bg-[#cfc3a0]/30"
          >
            {skill}
            <button 
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-[#b5a080] hover:text-[#cb4b16] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-[#b5a080] text-[10px] font-bold italic tracking-wide">No skills indexed yet.</p>
        )}
      </div>

      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddSkill}
        placeholder="Type a skill and press Enter..."
        className="w-full px-6 py-4 rounded-xl bg-[#eee8d5]/40 border border-[#cfc3a0] text-[#2d2013] placeholder:text-[#b5a080] focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-medium"
      />
    </div>
  );
}
