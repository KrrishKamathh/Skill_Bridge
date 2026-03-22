"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMousePosition } from "./useMousePosition";
import SkillManager from "./SkillManager";
import FileUploader from "./FileUploader";
import CertificateManager, { Certificate } from "./CertificateManager";
import ProjectManager, { Project } from "./ProjectManager";
import EducationManager, { Education } from "./EducationManager";
import ExperienceManager, { Experience } from "./ExperienceManager";
import SocialManager from "./SocialManager";
import PreferenceManager from "./PreferenceManager";
import AchievementManager from "./AchievementManager";

export default function ProfileForm({ 
  initialName, 
  initialEmail,
  role, 
  initialBio, 
  initialCompany,
  initialSkills,
  initialResumeUrl,
  initialCertificates,
  initialProjects,
  initialEducation,
  initialExperience,
  initialAchievements,
  initialPreferences,
  initialSocials
}: { 
  initialName: string, 
  initialEmail: string,
  role: string, 
  initialBio: string, 
  initialCompany: string,
  initialSkills: string[],
  initialResumeUrl?: string,
  initialCertificates: Certificate[],
  initialProjects: Project[],
  initialEducation: Education[],
  initialExperience: Experience[],
  initialAchievements: string[],
  initialPreferences: any,
  initialSocials: { github: string, linkedin: string, twitter: string }
}) {
  const router = useRouter();
  const mouse = useMousePosition();
  
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [skills, setSkills] = useState<string[]>(initialSkills || []);
  const [company, setCompany] = useState(initialCompany || "");
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl || "");
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates || []);
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [education, setEducation] = useState<Education[]>(initialEducation || []);
  const [experience, setExperience] = useState<Experience[]>(initialExperience || []);
  const [achievements, setAchievements] = useState<string[]>(initialAchievements || []);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [socials, setSocials] = useState(initialSocials);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'portfolio' | 'socials'>('personal');

  const getCompletion = () => {
    const fields = [name, bio, resumeUrl, !!skills.length, !!certificates.length, !!projects.length, !!education.length, socials.github, socials.linkedin];
    const filled = fields.filter(f => !!f).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, bio, company, skills, resumeUrl, certificates, 
        projects, education, experience, achievements, preferences, socials 
      }),
    });
    if (res.ok) {
      setStatus('success');
      router.refresh(); 
      setTimeout(() => setStatus('idle'), 3000);
    } else { setStatus('error'); }
  };

  const NavItem = ({ id, label, icon }: { id: any, label: string, icon: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
        activeTab === id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {activeTab === id && (
        <motion.div 
          layoutId="activeTabGlow"
          className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-2xl -z-10 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]"
        />
      )}
      <div className={`${activeTab === id ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400 transition-colors'}`}>
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="relative min-h-[800px]">
      {/* 
         SPOTLIGHT EFFECT HUB
         A subtle radial-gradient that follows the mouse to illuminate the dark UI.
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 space-y-2 shrink-0 bg-black/40 p-3 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="px-4 py-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Profile Sections</p>
          </div>
          
          <NavItem id="personal" label="Personal Details" icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          
          {role === "STUDENT" && (
            <>
              <NavItem id="professional" label="Professional Profile" icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>} />
              <NavItem id="portfolio" label="Portfolio & Documents" icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7 20 7"/></svg>} />
              <NavItem id="socials" label="Connected Accounts" icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/><path d="M12 16H6"/><path d="M12 12H6"/><path d="M12 8H6"/></svg>} />
            </>
          )}

          <div className="pt-8 px-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/[0.03] to-purple-600/[0.03] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Score</p>
                <span className="text-[10px] font-black text-blue-400">{getCompletion()}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getCompletion()}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 w-full bg-black/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-10 min-h-[700px] shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.section 
                key="personal"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Personal Details</h3>
                  <p className="text-sm text-slate-500">Manage your basic profile info and academic credentials.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/[0.02] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Display Name</label>
                    <input 
                      type="text" 
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                    <div className="px-6 py-4 rounded-2xl bg-white/[0.01] border border-white/5 text-slate-700 cursor-not-allowed italic text-sm">{initialEmail}</div>
                  </div>
                </div>

                {role === "STUDENT" && (
                  <>
                    <EducationManager initialEducation={education} onChange={setEducation} />
                    <AchievementManager initialAchievements={achievements} onChange={setAchievements} />
                  </>
                )}

                {role === "RECRUITER" && (
                  <div className="space-y-3 bg-white/[0.02] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Organization</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2" />
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'professional' && role === "STUDENT" && (
              <motion.section 
                key="professional"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Professional Profile</h3>
                  <p className="text-sm text-slate-500">Define your expertise, experience, and job expectations.</p>
                </div>

                <div className="space-y-8 bg-white/[0.02] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Professional Statement</label>
                    <textarea 
                      value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                      className="w-full px-6 py-5 rounded-2xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <SkillManager initialSkills={skills} onChange={setSkills} />
                </div>

                <ExperienceManager initialExperience={experience} onChange={setExperience} />
                <PreferenceManager initialPreferences={preferences} onChange={setPreferences} />
              </motion.section>
            )}

            {activeTab === 'portfolio' && role === "STUDENT" && (
              <motion.section 
                key="portfolio"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Portfolio & Documents</h3>
                  <p className="text-sm text-slate-500">Highlight your best work and verifiable certifications.</p>
                </div>

                <ProjectManager initialProjects={projects} onChange={setProjects} />

                <div className="grid grid-cols-1 gap-10">
                  <div className="bg-white/[0.02] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
                    <FileUploader 
                      label="Official Resume / CV" 
                      initialUrl={resumeUrl} 
                      onUploadComplete={setResumeUrl} 
                      accept="application/pdf,image/*" 
                    />
                  </div>
                  <div className="bg-white/[0.02] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
                    <CertificateManager initialCertificates={certificates} onChange={setCertificates} />
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'socials' && role === "STUDENT" && (
              <motion.section 
                key="socials"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
              >
                <SocialManager initialSocials={socials} onChange={setSocials} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Global Save Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-white/10 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-slate-400 font-medium tracking-tight">Centralized Persistence Hub</p>
              <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">Single-point Save Enabled</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                {status === 'success' && <span className="text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">✓ Verified Sync</span>}
                {status === 'error' && <span className="text-red-400 text-xs font-bold">✗ Sync Error</span>}
              </div>

              <button 
                type="submit" disabled={status === 'loading'}
                className="px-12 py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-3xl transition-all active:scale-95 flex items-center gap-3"
              >
                {status === 'loading' ? "Syncing..." : "Update All Hubs"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
