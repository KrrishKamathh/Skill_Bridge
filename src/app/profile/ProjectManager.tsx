"use client";

import { useState } from "react";

export interface Project {
  id?: string;
  title: string;
  description: string;
  url: string;
  techStack: string[];
}

interface ProjectManagerProps {
  initialProjects: Project[];
  onChange: (projects: Project[]) => void;
}

export default function ProjectManager({ initialProjects, onChange }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: "",
    description: "",
    url: "",
    techStack: []
  });

  const addProject = () => {
    if (newProject.title) {
      const updated = [...projects, { ...newProject }];
      setProjects(updated);
      onChange(updated);
      setNewProject({ title: "", description: "", url: "", techStack: [] });
    }
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-300">Portfolio & Live Projects</label>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Showcase Your Work</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, index) => (
          <div key={index} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{project.title}</h4>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline font-bold tracking-tight">
                      Visit Project ↗
                    </a>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{project.description}</p>
              {project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-white/5 text-slate-400 border border-white/5">{tech}</span>
                  ))}
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => removeProject(index)}
              className="p-2 hover:bg-red-500/10 rounded-xl text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
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
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
            className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
          <input 
            type="text" 
            placeholder="Link (GitHub/Live)"
            value={newProject.url}
            onChange={(e) => setNewProject({...newProject, url: e.target.value})}
            className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>
        <textarea 
          placeholder="Briefly describe what you built and the impact it had..."
          value={newProject.description}
          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium resize-none"
          rows={3}
        />
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Tech Stack (comma separated)"
            onChange={(e) => {
              const techs = e.target.value.split(',').map(s => s.trim()).filter(s => s !== "");
              setNewProject({...newProject, techStack: techs});
            }}
            className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
          <button 
            type="button"
            onClick={addProject}
            disabled={!newProject.title}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black rounded-2xl px-8 py-3.5 shadow-2xl shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-widest whitespace-nowrap"
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
