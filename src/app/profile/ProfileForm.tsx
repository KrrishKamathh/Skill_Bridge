"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SkillManager from "./SkillManager";
import FileUploader from "./FileUploader";
import CertificateManager, { Certificate } from "./CertificateManager";
import ProjectManager, { Project } from "./ProjectManager";
import EducationManager, { Education } from "./EducationManager";
import ExperienceManager, { Experience } from "./ExperienceManager";
import SocialManager from "./SocialManager";
import PreferenceManager from "./PreferenceManager";
import AchievementManager from "./AchievementManager";
import { 
  User, 
  Briefcase, 
  FileText, 
  Share2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";

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
      className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
        activeTab === id ? 'text-[#2d2013] bg-[#fdf6e3] shadow-sm border border-[#cfc3a0]' : 'text-[#7a6040] hover:text-[#2d2013] hover:bg-[#e5dcc5]'
      }`}
    >
      <div className={`${activeTab === id ? 'text-[#cb4b16]' : 'text-[#b5a080] group-hover:text-[#7a6040]'}`}>
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 space-y-6 shrink-0">
        <div className="bg-[#eee8d5] p-3 rounded-2xl border border-[#cfc3a0]">
          <div className="px-4 py-3 mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040]">Sections</p>
          </div>
          <div className="space-y-1">
            <NavItem id="personal" label="Basic Info" icon={<User className="w-4 h-4" />} />
            {role === "STUDENT" && (
              <>
                <NavItem id="professional" label="Experience" icon={<Briefcase className="w-4 h-4" />} />
                <NavItem id="portfolio" label="Showcase" icon={<FileText className="w-4 h-4" />} />
                <NavItem id="socials" label="Network" icon={<Share2 className="w-4 h-4" />} />
              </>
            )}
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white/80 p-6 rounded-2xl border border-[#cfc3a0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Completion</p>
            <span className="text-xl font-black text-[#2d2013]">{getCompletion()}%</span>
          </div>
          <div className="h-2 w-full bg-[#eee8d5] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getCompletion()}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-[#cb4b16] rounded-full shadow-[0_0_12px_rgba(203,75,22,0.3)]" 
            />
          </div>
          <p className="mt-4 text-[10px] font-bold text-[#b5a080] leading-tight">
            Higher scores unlock better AI matches and top-tier job visibility.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <form onSubmit={handleSubmit} className="flex-1 w-full bg-white/80 border border-[#cfc3a0] rounded-3xl backdrop-blur-xl shadow-xl overflow-hidden min-h-[700px] flex flex-col">
        
        <div className="flex-1 p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'personal' && (
                <div className="space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#2d2013] tracking-tighter">Basic Info</h3>
                    <p className="text-sm text-[#7a6040] font-medium leading-relaxed">Your identity on the platform. Keep your name updated for formal communications.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040] ml-1">Legal Name</label>
                      <input 
                        type="text" 
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl bg-[#eee8d5]/40 border border-[#cfc3a0] text-[#2d2013] font-bold focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/20 focus:border-[#cb4b16] transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040] ml-1">Email <span className="text-[#b5a080]">(Verified)</span></label>
                      <div className="px-6 py-4 rounded-xl bg-[#eee8d5]/20 border border-[#cfc3a0] text-[#b5a080] italic text-sm font-medium">{initialEmail}</div>
                    </div>
                  </div>

                  {role === "STUDENT" && (
                    <>
                      <div className="pt-6">
                        <EducationManager initialEducation={education} onChange={setEducation} />
                      </div>
                      <div className="pt-6">
                        <AchievementManager initialAchievements={achievements} onChange={setAchievements} />
                      </div>
                    </>
                  )}

                  {role === "RECRUITER" && (
                    <div className="space-y-3 pt-6">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040] ml-1">Organization / Company</label>
                      <input 
                        type="text" 
                        value={company} onChange={(e) => setCompany(e.target.value)} 
                        className="w-full px-6 py-4 rounded-xl bg-[#eee8d5]/40 border border-[#cfc3a0] text-[#2d2013] font-bold focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm" 
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'professional' && role === "STUDENT" && (
                <div className="space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#2d2013] tracking-tighter">Experience</h3>
                    <p className="text-sm text-[#7a6040] font-medium">Define your narrative. What projects have you conquered?</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040] ml-1">Professional Statement</label>
                      <textarea 
                        value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                        className="w-full px-6 py-5 rounded-xl bg-[#eee8d5]/40 border border-[#cfc3a0] text-[#2d2013] font-medium focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm resize-none"
                        placeholder="Expertise in..."
                      />
                    </div>
                    <SkillManager initialSkills={skills} onChange={setSkills} />
                  </div>

                  <ExperienceManager initialExperience={experience} onChange={setExperience} />
                  <PreferenceManager initialPreferences={preferences} onChange={setPreferences} />
                </div>
              )}

              {activeTab === 'portfolio' && role === "STUDENT" && (
                <div className="space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#2d2013] tracking-tighter">Showcase</h3>
                    <p className="text-sm text-[#7a6040] font-medium text-balance">The tangible proof of your skill. Upload your resume and highlight your best builds.</p>
                  </div>

                  <ProjectManager initialProjects={projects} onChange={setProjects} />

                  <div className="grid grid-cols-1 gap-12">
                    <FileUploader 
                      label="Official Resume / CV (PDF)" 
                      initialUrl={resumeUrl} 
                      onUploadComplete={setResumeUrl} 
                      accept="application/pdf,image/*" 
                    />
                    <div className="pt-6 border-t border-[#cfc3a0]">
                      <CertificateManager initialCertificates={certificates} onChange={setCertificates} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'socials' && role === "STUDENT" && (
                <div className="space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#2d2013] tracking-tighter">Network</h3>
                    <p className="text-sm text-[#7a6040] font-medium">Link your professional presence across the web.</p>
                  </div>
                  <SocialManager initialSocials={socials} onChange={setSocials} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action bar */}
        <div className="p-8 border-t border-[#cfc3a0] bg-[#eee8d5]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {status === 'success' && (
              <span className="flex items-center gap-2 text-xs font-black text-[#2aa198] uppercase tracking-widest bg-[#2aa198]/10 px-4 py-2 rounded-full border border-[#2aa198]/20">
                <CheckCircle2 className="w-4 h-4" /> Sync Verified
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-2 text-xs font-black text-[#cb4b16] uppercase tracking-widest bg-[#cb4b16]/10 px-4 py-2 rounded-full border border-[#cb4b16]/20">
                <AlertCircle className="w-4 h-4" /> Sync Failed
              </span>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full sm:w-auto px-10 py-4 bg-[#2d2013] text-[#fdf6e3] font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#cb4b16] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Syncing Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Commit Updates
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
