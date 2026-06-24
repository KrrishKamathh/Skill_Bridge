// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Target,
  ExternalLink,
  GraduationCap,
  Trophy,
  Globe,
  Settings,
  Terminal,
  Trash2,
  FileText,
  Building,
  Edit3,
  Upload,
  Users,
  X,
  Bookmark,
  BookmarkCheck,
  Heart
} from "lucide-react";

type DashboardTab = "overview" | "marketplace" | "applications" | "talent" | "personal" | "qualifications" | "portfolio" | "company" | "listings" | "watchlist" | "upskill";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>("personal");
  const [userData, setUserData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form States
  const [personalData, setPersonalData] = useState({ dob: "", location: "", bio: "", username: "", githubUrl: "", linkedinUrl: "" });
  const [qualData, setQualData] = useState({ college: "", school: "", cgpa: "", resumeUrl: "" });
  const [newProject, setNewProject] = useState({ id: "", title: "", description: "", evidenceLink: "" });
  const [recruiterData, setRecruiterData] = useState({ companyName: "", designation: "", publicBio: "" });
  const [newJob, setNewJob] = useState({ title: "", type: "Full-time", location: "", salary: "", requirements: "", description: "" });

  const calculateProfileStrength = () => {
    let strength = 0;
    if (personalData.bio) strength += 20;
    if (personalData.location) strength += 10;
    if (personalData.githubUrl) strength += 15;
    if (personalData.linkedinUrl) strength += 15;
    if (qualData.resumeUrl) strength += 20;
    if ((userData?.studentProfile?.projects?.length || 0) > 0) strength += 20;
    return strength;
  };

  const [viewingJob, setViewingJob] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [talentPool, setTalentPool] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isModalTechExpanded, setIsModalTechExpanded] = useState(false);
  const [expandedJobTech, setExpandedJobTech] = useState<Set<string>>(new Set());
  const [marketplaceJobs, setMarketplaceJobs] = useState<any[]>([]);

  // Rejection & Skill-Gap States
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedAppForRejection, setSelectedAppForRejection] = useState<any>(null);
  const [rejectionForm, setRejectionForm] = useState({ feedback: "", skills: "", courses: "" });
  const [viewingSkillGap, setViewingSkillGap] = useState<any>(null);

  // Watchlist States
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(new Set());

  // UI States
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const startResizing = (e: any) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 450) newWidth = 450;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const userRole = (session?.user as any)?.role || "STUDENT";
  const router = useRouter();

  const fetchProfile = async () => {
    if (session?.user?.email) {
      setLoading(true);
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (data.role === "RECRUITER" && activeTab === "personal") {
          setActiveTab("overview");
        }

        if (res.ok) {
          setUserData(data);
          
          // Only redirect if we ARE CERTAIN there's no profile and it's not a fresh load
          if (!data.studentProfile && !data.recruiterProfile) {
            console.warn("No profile found for user, redirecting to onboarding...");
            router.push("/onboarding");
            return;
          }
          if (data.studentProfile) {
            setPersonalData({ 
              dob: data.studentProfile.dob?.split('T')[0] || "", 
              location: data.studentProfile.location || "", 
              bio: data.studentProfile.bio || "", 
              username: data.username || "",
              githubUrl: data.studentProfile.githubUrl || "",
              linkedinUrl: data.studentProfile.linkedinUrl || ""
            });
            setQualData({ 
              college: data.studentProfile.college || "", 
              school: data.studentProfile.school || "", 
              cgpa: data.studentProfile.cgpa?.toString() || "",
              resumeUrl: data.studentProfile.resumeUrl || "" 
            });
          }
          if (data.recruiterProfile) {
            setRecruiterData({ 
              companyName: data.recruiterProfile.companyName || "", 
              designation: data.recruiterProfile.designation || "",
              publicBio: data.recruiterProfile.publicBio || "" 
            });
            setJobs(data.recruiterProfile.jobs || []);
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
  };

  const fetchMarketplace = async () => {
    try {
      const res = await fetch("/api/jobs/marketplace", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setMarketplaceJobs(data);
    } catch (e) { console.error(e); }
  };

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
      if (res.ok) {
        alert("Application sent successfully!");
        fetchMarketplace();
        fetchMyApplications();
      }
    } catch (e) { console.error(e); }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await fetch("/api/applications/my", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setMyApplications(data);
    } catch (e) { console.error(e); }
  };

  const fetchTalent = async () => {
    try {
      const res = await fetch("/api/students/browse");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        let hiddenIds: string[] = [];
        try {
          const hiddenRaw = localStorage.getItem("hidden_talent_pool");
          if (hiddenRaw) hiddenIds = JSON.parse(hiddenRaw);
        } catch (e) { console.error(e); }
        setTalentPool(data.filter((student: any) => !hiddenIds.includes(student.id)));
      }
    } catch (e) { console.error(e); }
  };

  // Filter States
  const [filters, setFilters] = useState({ minCgpa: "", collegeKeyword: "", skillKeywords: "" });

  // Shared synonym map used by BOTH scoring and gap detection
  const skillSynonyms: Record<string, string[]> = {
    "react": ["react", "nextjs", "next.js", "frontend"],
    "node": ["node", "express", "backend"],
    "typescript": ["typescript", "ts"],
    "javascript": ["javascript", "js"],
    "figma": ["figma", "ui/ux", "design", "prototyping"],
    "photoshop": ["photoshop", "illustrator", "graphic", "design", "creative"],
    "illustrator": ["illustrator", "photoshop", "graphic", "design", "creative"],
    "graphic design": ["graphic design", "design", "photoshop", "illustrator", "figma"],
    "creative suite": ["creative suite", "photoshop", "illustrator", "adobe", "design"],
    "sql": ["sql", "postgres", "mysql", "database"],
    "prisma": ["prisma", "orm", "database"],
    "tailwind": ["tailwind", "css"],
    "python": ["python", "ml", "ai", "data science"],
  };

  const skillMatchedInText = (skill: string, studentText: string): boolean => {
    const normalized = skill.toLowerCase();
    if (studentText.includes(normalized)) return true;
    const synonyms = skillSynonyms[normalized];
    if (synonyms) return synonyms.some(syn => studentText.includes(syn));
    return false;
  };

  const calculateJobMatchScore = (student: any, job: any): number => {
    if (!student || !job) return 50;

    const studentText = `${student.bio || ""} ${student.school || ""} ${student.college || ""} ${student.achievements || ""} ${student.projects?.map((p: any) => p.title + " " + p.description).join(" ") || ""}`.toLowerCase();

    // If NO requirements are listed, fall back to profile completeness score
    if (!job.requirements || !job.requirements.trim()) {
      let base = 40;
      if (student.college) base += 10;
      if (student.resumeUrl) base += 15;
      base += Math.min((student.projects?.length || 0) * 5, 20);
      return Math.min(base, 75);
    }

    const reqs = job.requirements.split(",").map((r: string) => r.trim()).filter(Boolean);
    if (reqs.length === 0) return 50;

    // Count how many requirements the student actually satisfies
    let matchedCount = 0;
    reqs.forEach((req: string) => {
      if (skillMatchedInText(req, studentText)) matchedCount++;
    });

    const matchRatio = matchedCount / reqs.length;

    // Score = 20% base (just for being a user) + up to 78% from skill matching
    // So: 0 skills matched = 20%, all skills matched = 98%
    const score = 20 + Math.round(matchRatio * 78);

    return Math.min(Math.max(score, 10), 98);
  };

  const getMissingSkills = (student: any, job: any): string[] => {
    if (!student || !job || !job.requirements) return [];

    const studentText = `${student.bio || ""} ${student.school || ""} ${student.college || ""} ${student.achievements || ""} ${student.projects?.map((p: any) => p.title + " " + p.description).join(" ") || ""}`.toLowerCase();

    const reqs = job.requirements.split(",").map((r: string) => r.trim()).filter(Boolean);
    const missing: string[] = [];

    reqs.forEach((req: string) => {
      if (!skillMatchedInText(req, studentText)) {
        missing.push(req);
      }
    });

    return missing;
  };


  const calculateProfileStrengthForStudent = (student: any): number => {
    if (!student) return 0;
    let score = 30; // base profile score
    if (student.college) score += 15;
    if (student.school) score += 10;
    if (student.cgpa) score += 15;
    if (student.resumeUrl) score += 15;
    score += Math.min((student.projects?.length || 0) * 10, 30);
    return Math.min(score, 100);
  };

  const getFilteredApplicants = () => {
    if (!applicants) return [];
    
    // 1. Calculate matching score specifically for this job
    const scoredApplicants = applicants.map(app => {
      const matchScore = calculateJobMatchScore(app.user.studentProfile, selectedJob);
      return { ...app, aiScore: matchScore };
    });

    // 2. Sort by match score descending (best matches first!)
    const sorted = scoredApplicants.sort((a, b) => b.aiScore - a.aiScore);

    // 3. Filter the sorted list
    return sorted.filter(app => {
      const student = app.user.studentProfile;
      if (!student) return true;

      if (filters.minCgpa && student.cgpa < parseFloat(filters.minCgpa)) return false;

      if (filters.collegeKeyword && !student.college?.toLowerCase().includes(filters.collegeKeyword.toLowerCase())) {
        return false;
      }

      if (filters.skillKeywords) {
        const keywords = filters.skillKeywords.toLowerCase().split(',').map(s => s.trim());
        const studentContent = `${student.bio} ${student.achievements} ${student.projects?.map((p: any) => p.title + ' ' + p.description).join(' ')}`.toLowerCase();
        
        const synonyms: Record<string, string[]> = {
          "aiml": ["ai", "ml", "machine learning", "artificial intelligence", "deep learning", "neural", "python", "data science"],
          "frontend": ["react", "vue", "angular", "tailwind", "css", "html", "nextjs"],
          "backend": ["node", "express", "java", "spring", "sql", "postgres", "prisma", "api", "rest"],
          "fullstack": ["mern", "nextjs", "t3", "database", "ui", "ux"]
        };

        const matches = keywords.every(kw => {
          if (studentContent.includes(kw)) return true;
          if (synonyms[kw]?.some(syn => studentContent.includes(syn))) return true;
          return false;
        });

        if (!matches) return false;
      }

      return true;
    });
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setBookmarks(data);
        setBookmarkedJobIds(new Set(data.map((b: any) => b.jobId)));
      }
    } catch (e) { console.error(e); }
  };

  const toggleBookmark = async (jobId: string) => {
    try {
      if (bookmarkedJobIds.has(jobId)) {
        await fetch("/api/bookmarks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
      } else {
        await fetch("/api/bookmarks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
      }
      fetchBookmarks();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { 
    fetchProfile(); 
    if (userRole === "STUDENT") {
      fetchMarketplace();
      fetchMyApplications();
      fetchBookmarks();
    } else {
      fetchTalent();
    }
  }, [session]);

  const handleUpdate = async (data: any) => {
    setSaveLoading(true);
    try {
      await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      fetchProfile();
      alert("Saved!");
    } catch (e) { console.error(e); } finally { setSaveLoading(false); }
  };

  const fetchApplicants = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/applicants`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setApplicants(data);
        setSelectedJob(jobId);
      }
    } catch (e) { console.error(e); }
  };

  const updateApplicationStatus = async (appId: string, status: string, extraData: any = {}) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extraData })
      });
      if (res.ok) {
        if (selectedJob) fetchApplicants(selectedJob);
        setIsRejectionModalOpen(false);
        setRejectionForm({ feedback: "", skills: "", courses: "" });
      }
    } catch (e) { console.error(e); }
  };

  const handlePostJob = async () => {
    if (!newJob.title) return;
    setSaveLoading(true);
    try {
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newJob.title, jobType: newJob.type, location: newJob.location, salary: newJob.salary, requirements: newJob.requirements, description: newJob.description }) });
      if (res.ok) {
        setNewJob({ title: "", type: "Full-time", location: "", salary: "", requirements: "", description: "" });
        fetchProfile();
        alert("Job posted!");
      }
    } catch (e) { console.error(e); } finally { setSaveLoading(false); }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Close this job listing?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) fetchProfile();
    } catch (e) { console.error(e); }
  };

  if (!session) return null;

  const NavItem = ({ icon, label, active, onClick, badge }: any) => (
    <button onClick={onClick} className={`relative flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 font-bold ${active ? 'bg-[#cb4b16] text-[#fdf6e3] shadow-lg scale-[1.02]' : 'text-[#7a6040] hover:bg-[#cfc3a0]/30 hover:text-[#2d2013]'}`}>
      <span className={active ? 'text-white' : 'text-[#cb4b16]'}>{icon}</span>
      <span className="text-xs uppercase tracking-widest">{label}</span>
      {badge > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#2d2013] font-sans selection:bg-[#cb4b16]/20 flex">
      
      {/* Resizable Sidebar */}
      <aside 
        style={{ width: sidebarWidth }}
        className="fixed left-0 top-0 h-full bg-[#eee8d5] border-r border-[#cfc3a0] hidden lg:flex flex-col p-6 z-50 transition-[width] duration-75 ease-out group/sidebar"
      >
        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-[#cb4b16] transition-colors z-50 ${isResizing ? 'bg-[#cb4b16]' : 'bg-transparent'}`}
        />

        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-[#cb4b16] flex items-center justify-center shadow-lg"><div className="w-2 h-2 bg-[#fdf6e3] rounded-full" /></div>
          <span className="font-bold text-lg tracking-tighter truncate">SkillBridge</span>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {userRole === "STUDENT" ? (
            <>
              <NavItem icon={<UserIcon className="w-4 h-4" />} label="Identity" active={activeTab === "personal"} onClick={() => setActiveTab("personal")} />
              <NavItem icon={<Trophy className="w-4 h-4" />} label="Dossier" active={activeTab === "qualifications"} onClick={() => setActiveTab("qualifications")} />
              <NavItem icon={<Globe className="w-4 h-4" />} label="Job Board" active={activeTab === "marketplace"} onClick={() => setActiveTab("marketplace")} />
              <NavItem icon={<FileText className="w-4 h-4" />} label="Applications" active={activeTab === "applications"} onClick={() => setActiveTab("applications")} badge={myApplications?.length || 0} />
              <NavItem icon={<Bookmark className="w-4 h-4" />} label="Watchlist" active={activeTab === "watchlist"} onClick={() => setActiveTab("watchlist")} badge={bookmarks?.length || 0} />
              <NavItem icon={<GraduationCap className="w-4 h-4" />} label="Upskill Hub" active={activeTab === "upskill"} onClick={() => setActiveTab("upskill")} />
            </>
          ) : (
            <>
              <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
              <NavItem icon={<Briefcase className="w-4 h-4" />} label="My Listings" active={activeTab === "listings"} onClick={() => setActiveTab("listings")} badge={jobs?.length || 0} />
              <NavItem icon={<Users className="w-4 h-4" />} label="Talent Pool" active={activeTab === "talent"} onClick={() => setActiveTab("talent")} badge={talentPool?.length || 0} />
              <NavItem icon={<Building className="w-4 h-4" />} label="Company" active={activeTab === "company"} onClick={() => setActiveTab("company")} />
            </>
          )}
        </nav>

        {/* Cinematic Profile Section */}
        <div className="mt-auto pt-6 border-t border-[#cfc3a0] relative flex justify-center">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-12 h-12 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center font-black text-lg shadow-xl hover:scale-110 hover:bg-[#cb4b16] transition-all cursor-pointer relative z-[70]"
          >
            {session?.user?.name?.[0]}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 w-full mb-4 bg-[#fdf6e3] border border-[#cfc3a0] rounded-[2rem] shadow-2xl overflow-hidden z-[60]"
              >
                <div className="p-6 bg-[#2d2013] text-[#fdf6e3]">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#cb4b16] mb-1">Authenticated Account</p>
                  <p className="text-sm font-black tracking-tight truncate">{session?.user?.name}</p>
                  <p className="text-[10px] font-bold text-[#eee8d5]/60 truncate">{session?.user?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <div className="px-4 py-2 border-b border-[#cfc3a0]/30 mb-1">
                    <p className="text-[10px] font-bold text-[#2d2013] uppercase tracking-widest">{userRole}</p>
                  </div>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/login" })} 
                    className="flex items-center gap-3 w-full p-4 text-[10px] text-[#7a6040] hover:bg-red-500 hover:text-white transition-all rounded-xl font-black uppercase tracking-widest"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <main 
        style={{ paddingLeft: sidebarWidth }}
        className="flex-1 min-h-screen transition-[padding] duration-75 ease-out"
      >
        <div className="max-w-6xl mx-auto p-8">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Workspace</p>
              <h1 className="text-4xl font-black tracking-tighter text-[#2d2013] capitalize">{activeTab}</h1>
            </div>
            {userRole === "RECRUITER" && activeTab === "listings" && (
              <button onClick={() => setActiveTab("overview")} className="px-6 py-3 bg-[#cb4b16] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">Post Role</button>
            )}
          </header>

          <AnimatePresence mode="wait">
            {userRole === "RECRUITER" && activeTab === "company" && (
              <motion.div key="company" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
                <div className="bg-[#2d2013] rounded-[2.5rem] p-10 text-[#fdf6e3] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10"><Building className="w-32 h-32 rotate-12" /></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Verified Recruiter</p>
                    <h3 className="text-3xl font-black tracking-tighter mb-4">Corporate Identity</h3>
                    <p className="text-xs text-[#eee8d5]/60 font-medium leading-relaxed">Manage how your company appears to the global talent pool. A complete profile increases application quality by 40%.</p>
                  </div>
                </div>

                <div className="bg-white/60 border border-[#cfc3a0] rounded-[3rem] p-10 shadow-sm">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Company Name</label>
                        <input value={recruiterData.companyName} onChange={(e) => setRecruiterData({...recruiterData, companyName: e.target.value})} className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Your Designation</label>
                        <input value={recruiterData.designation} onChange={(e) => setRecruiterData({...recruiterData, designation: e.target.value})} placeholder="e.g. Senior Talent Scout" className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Corporate Mission / Public Bio</label>
                      <textarea rows={5} value={recruiterData.publicBio} onChange={(e) => setRecruiterData({...recruiterData, publicBio: e.target.value})} placeholder="Describe your company culture and mission..." className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold resize-none" />
                    </div>

                    <button 
                      onClick={() => handleUpdate(recruiterData)} 
                      className="w-full py-5 rounded-2xl bg-[#2d2013] text-[#fdf6e3] font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-xl"
                    >
                      Update Brand Identity
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {userRole === "RECRUITER" && activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                {/* Hiring Momentum Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Total Reach", value: "12.4k", icon: <Globe className="w-4 h-4" /> },
                    { label: "Evidence Verified", value: "482", icon: <ShieldCheck className="w-4 h-4" /> },
                    { label: "Active Listings", value: jobs.length, icon: <Briefcase className="w-4 h-4" /> },
                    { label: "Hiring Velocity", value: "HIGH", icon: <TrendingUp className="w-4 h-4" /> },
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-[#cb4b16]">
                        {stat.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <p className="text-3xl font-black tracking-tighter text-[#2d2013]">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#2d2013] rounded-[3rem] p-12 text-[#fdf6e3] relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles className="w-48 h-48 rotate-12" /></div>
                  <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-black tracking-tighter mb-6 leading-none">Deploy Your Next Star.</h2>
                    <p className="text-[#eee8d5]/80 text-sm leading-relaxed font-medium mb-8">Post roles, analyze evidence, and hire at the speed of thought. Your dashboard is now calibrated for high-velocity screening.</p>
                  </div>
                </div>

                <div className="bg-white/60 border border-[#cfc3a0] rounded-[3rem] p-10 shadow-sm">
                  <h3 className="text-xl font-black tracking-tight mb-8">Post New Job</h3>
                  <div className="space-y-4">
                    <input type="text" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Job Title" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                    <div className="grid grid-cols-2 gap-4">
                      <select value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold appearance-none"><option>Full-time</option><option>Internship</option></select>
                      <input type="text" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Location" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={newJob.salary} onChange={(e) => setNewJob({...newJob, salary: e.target.value})} placeholder="Salary Range (e.g. $60k - $80k)" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                      <input type="text" value={newJob.requirements} onChange={(e) => setNewJob({...newJob, requirements: e.target.value})} placeholder="Tech Stack Requirements (e.g. React, Node)" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                    </div>
                    <textarea rows={4} value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Job Description..." className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold resize-none" />
                    <button onClick={handlePostJob} className="w-full py-5 bg-[#2d2013] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-xl">Post Listing</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "marketplace" && (
              <motion.div key="marketplace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceJobs.map((job) => (
                  <div 
                    key={job.id} 
                    onClick={() => setViewingJob(job)}
                    className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-[#cb4b16] transition-colors">{job.recruiterProfile?.companyName?.[0]}</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }}
                          className={`p-2 rounded-xl transition-all hover:scale-110 ${
                            bookmarkedJobIds.has(job.id) 
                              ? 'text-[#cb4b16] bg-[#cb4b16]/10' 
                              : 'text-[#7a6040]/40 hover:text-[#cb4b16]'
                          }`}
                        >
                          {bookmarkedJobIds.has(job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[8px] font-black uppercase tracking-widest border border-orange-500/20">
                          <Sparkles className="w-2 h-2" /> {userData?.studentProfile ? calculateJobMatchScore(userData.studentProfile, job) : (job.aiMatchScore !== undefined ? job.aiMatchScore : (85 + (job.title.length % 15)))}% Match
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#cb4b16]/10 text-[#cb4b16] text-[8px] font-black uppercase tracking-widest">{job.type || job.jobType}</span>
                        <span className="text-[8px] font-bold text-[#7a6040] uppercase tracking-widest">{job.location}</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-black tracking-tight text-[#2d2013] mb-1">{job.title}</h4>
                    <p className="text-[10px] font-black text-[#cb4b16] uppercase tracking-widest mb-3">{job.recruiterProfile?.companyName}</p>
                    
                    {job.salary && (
                      <div className="text-xs font-black text-green-700 mb-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">💰 {job.salary}</span>
                      </div>
                    )}
                    
                    {job.requirements && (
                      <div className="flex flex-wrap gap-1 mb-4" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                          const reqs = job.requirements.split(',');
                          const isExpanded = expandedJobTech.has(job.id);
                          if (reqs.length <= 1 || isExpanded) {
                            return reqs.map((req: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-[#cb4b16]/5 border border-[#cb4b16]/10 text-[#cb4b16] text-[8px] font-black uppercase tracking-widest">{req.trim()}</span>
                            ));
                          } else {
                            return (
                              <>
                                <span className="px-2 py-0.5 rounded-md bg-[#cb4b16]/5 border border-[#cfc3a0] text-[#7a6040] text-[8px] font-black uppercase tracking-widest">{reqs[0].trim()}</span>
                                <button 
                                  onClick={() => {
                                    const next = new Set(expandedJobTech);
                                    next.add(job.id);
                                    setExpandedJobTech(next);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-[#cb4b16] text-white text-[8px] font-black hover:bg-[#cb4b16]/80 transition-all shadow-sm cursor-pointer"
                                >
                                  ...
                                </button>
                              </>
                            );
                          }
                        })()}
                      </div>
                    )}

                    {userData?.studentProfile && (
                      (() => {
                        const missing = getMissingSkills(userData.studentProfile, job);
                        if (missing.length > 0) {
                          return (
                            <div className="mb-4 flex flex-wrap gap-1 items-center">
                              <span className="text-[8px] font-black text-red-600 uppercase tracking-widest mr-1">Missing Gaps:</span>
                              {missing.map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20 text-[7px] font-black uppercase tracking-widest">{skill}</span>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })()
                    )}
                    
                    <p className="text-xs text-[#7a6040] line-clamp-3 leading-relaxed mb-8">{job.description}</p>
                    <div className="mt-auto w-full bg-[#2d2013]/5 text-[#2d2013] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-[#cb4b16] group-hover:text-white transition-all text-center">
                      Analyze Role
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "applications" && (
              <motion.div key="applications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {myApplications?.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white/40 border border-dashed border-[#cfc3a0] rounded-[3rem] flex flex-col items-center justify-center group hover:bg-white/60 transition-all cursor-pointer shadow-sm" onClick={() => setActiveTab("marketplace")}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="w-24 h-24 bg-[#cb4b16]/10 rounded-full flex items-center justify-center mb-6 text-[#cb4b16] shadow-inner">
                      <Briefcase className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-[#2d2013] mb-2 tracking-tight">No Active Applications</h3>
                    <p className="text-sm font-bold text-[#7a6040] max-w-sm leading-relaxed mx-auto">Your intelligence profile is hungry for data. Browse the Job Board and apply to relevant roles.</p>
                    <div className="mt-8 px-8 py-4 bg-[#2d2013] text-[#fdf6e3] rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-xl group-hover:bg-[#cb4b16] transition-all">Explore Marketplace</div>
                  </motion.div>
                ) : (
                  myApplications?.map((app) => (
                    <div key={app.id} className="p-6 bg-white/60 border border-[#cfc3a0] rounded-3xl flex items-center justify-between group hover:shadow-lg transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center font-black"><Briefcase className="w-6 h-6" /></div>
                        <div>
                          <h4 className="font-black text-lg">{app.job.title}</h4>
                          <p className="text-xs font-bold text-[#cb4b16] uppercase tracking-tight">{app.job.recruiterProfile?.companyName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          app.status === "SHORTLISTED" ? "bg-green-500 text-white shadow-lg" : 
                          app.status === "REJECTED" ? "bg-red-500 text-white" : 
                          "bg-[#cb4b16] text-white"
                        }`}>
                          {app.status}
                        </span>
                        {app.status === "REJECTED" && (
                          <button 
                            onClick={() => setViewingSkillGap(app)}
                            className="block w-full mt-2 text-[8px] font-black uppercase tracking-widest text-[#cb4b16] hover:underline"
                          >
                            Analyze Rejection
                          </button>
                        )}
                        <p className="text-[10px] text-[#7a6040] mt-2 font-bold">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "watchlist" && (
              <motion.div key="watchlist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Watchlist Header */}
                <div className="bg-[#2d2013] rounded-[2.5rem] p-10 text-[#fdf6e3] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10"><Bookmark className="w-32 h-32 rotate-12" /></div>
                  <div className="relative z-10">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Saved Roles</p>
                    <h3 className="text-3xl font-black tracking-tighter mb-2">Your Career Watchlist</h3>
                    <p className="text-xs text-[#eee8d5]/60 font-medium">Roles you've bookmarked for future applications. {bookmarks.length} saved.</p>
                  </div>
                </div>

                {bookmarks.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white/40 border border-dashed border-[#cfc3a0] rounded-[3rem] flex flex-col items-center justify-center group hover:bg-white/60 transition-all cursor-pointer shadow-sm" onClick={() => setActiveTab("marketplace")}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-24 h-24 bg-[#cb4b16]/10 rounded-full flex items-center justify-center mb-6 text-[#cb4b16] shadow-inner">
                      <Bookmark className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-[#2d2013] mb-2 tracking-tight">Watchlist Empty</h3>
                    <p className="text-sm font-bold text-[#7a6040] max-w-sm leading-relaxed mx-auto">Save roles that catch your eye while browsing. They'll be waiting for you here when you're ready.</p>
                    <div className="mt-8 px-8 py-4 bg-[#2d2013] text-[#fdf6e3] rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-xl group-hover:bg-[#cb4b16] transition-all">Find Roles</div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarks.map((bm: any) => (
                      <div key={bm.id} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-[#cb4b16] transition-colors">{bm.job?.recruiterProfile?.companyName?.[0] || "S"}</div>
                          <button 
                            onClick={() => toggleBookmark(bm.jobId)}
                            className="p-2 text-[#cb4b16] bg-[#cb4b16]/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-lg font-black tracking-tight text-[#2d2013] mb-1">{bm.job?.title}</h4>
                        <p className="text-[10px] font-black text-[#cb4b16] uppercase tracking-widest mb-2">{bm.job?.recruiterProfile?.companyName}</p>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-[#7a6040] uppercase tracking-widest mb-6">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {bm.job?.location}</span>
                          <span className="px-2 py-0.5 bg-[#cb4b16]/10 text-[#cb4b16] rounded-full">{bm.job?.jobType}</span>
                        </div>
                        <p className="text-xs text-[#7a6040] line-clamp-2 leading-relaxed mb-6">{bm.job?.description}</p>
                        <div className="mt-auto flex gap-3">
                          <button 
                            onClick={() => setViewingJob(bm.job)}
                            className="flex-1 py-4 rounded-2xl bg-[#2d2013] text-[#fdf6e3] font-black uppercase tracking-widest text-[10px] hover:bg-[#cb4b16] transition-all shadow-md text-center"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleApply(bm.jobId)}
                            className="flex-1 py-4 rounded-2xl bg-[#cb4b16] text-white font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-md text-center"
                          >
                            Apply Now
                          </button>
                        </div>
                        <p className="text-[8px] text-[#7a6040]/50 font-bold mt-3 text-center">Saved {new Date(bm.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "upskill" && (
              <motion.div key="upskill" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
                {/* Upskill Hub Header */}
                <div className="bg-[#2d2013] rounded-[2.5rem] p-10 text-[#fdf6e3] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10"><GraduationCap className="w-32 h-32 rotate-12" /></div>
                  <div className="relative z-10">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Technical Upgrades</p>
                    <h3 className="text-3xl font-black tracking-tighter mb-2">Upskill & Certification Hub</h3>
                    <p className="text-xs text-[#eee8d5]/60 font-medium">Bridge your engineering requirements, view recommended coursework, and upload verified certification proofs to level up your matchmaking scores.</p>
                  </div>
                </div>

                {/* Aggregated Missing Skills Grid */}
                {(() => {
                  const studentProfile = userData?.studentProfile;
                  if (!studentProfile) return null;

                  // Gather all missing skills from bookmarked jobs and rejection reports
                  const missingSkillsSet = new Set<string>();
                  const skillSources: Record<string, string[]> = {};
                  
                  // 1. Scan bookmarks
                  bookmarks.forEach((bm: any) => {
                    if (bm.job) {
                      const gaps = getMissingSkills(studentProfile, bm.job);
                      gaps.forEach(skill => {
                        missingSkillsSet.add(skill);
                        if (!skillSources[skill]) skillSources[skill] = [];
                        if (!skillSources[skill].includes(bm.job.title)) {
                          skillSources[skill].push(bm.job.title);
                        }
                      });
                    }
                  });

                  // 2. Scan active rejections for missing skill feedback
                  myApplications.forEach((app: any) => {
                    if (app.status === "REJECTED" && app.skillGaps) {
                      const gaps = app.skillGaps.split(",").map((s: string) => s.trim());
                      gaps.forEach((skill: string) => {
                        if (skill) {
                          missingSkillsSet.add(skill);
                          if (!skillSources[skill]) skillSources[skill] = [];
                          if (!skillSources[skill].includes(`Rejection Feedback (${app.job.title})`)) {
                            skillSources[skill].push(`Rejection Feedback (${app.job.title})`);
                          }
                        }
                      });
                    }
                  });

                  const missingSkills = Array.from(missingSkillsSet);

                  if (missingSkills.length === 0) {
                    return (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white/40 border border-dashed border-[#cfc3a0] rounded-[2.5rem] shadow-sm">
                        <div className="w-20 h-20 bg-[#cb4b16]/10 rounded-full flex items-center justify-center mb-6 text-[#cb4b16] shadow-inner mx-auto">
                          <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-[#2d2013] mb-2 tracking-tight">Zero Skill Gaps Detected!</h3>
                        <p className="text-sm font-bold text-[#7a6040] max-w-md leading-relaxed mx-auto">Outstanding work. Your current achievements, projects, and credentials satisfy the requirements of all bookmarked and rejected roles.</p>
                      </motion.div>
                    );
                  }

                  const courseDirectory: Record<string, { title: string, url: string }> = {
                    "react": { title: "React Official Docs & Quickstart", url: "https://react.dev" },
                    "next.js": { title: "Next.js Interactive Dashboard Tutorial", url: "https://nextjs.org/learn" },
                    "nextjs": { title: "Next.js Interactive Dashboard Tutorial", url: "https://nextjs.org/learn" },
                    "typescript": { title: "TypeScript Deep Dive Handbook", url: "https://www.typescriptlang.org/docs/" },
                    "javascript": { title: "Modern JavaScript (MDN Guides)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
                    "node": { title: "Node.js Complete Getting Started Guides", url: "https://nodejs.org/en/docs" },
                    "express": { title: "Express.js RESTful API Tutorial", url: "https://expressjs.com/" },
                    "figma": { title: "Figma UI/UX Essentials Design Course", url: "https://www.figma.com/resources/learn-design/" },
                    "photoshop": { title: "Adobe Photoshop Certified Training Guide", url: "https://helpx.adobe.com/photoshop/tutorials.html" },
                    "sql": { title: "SQL Database Complete Crashcourse", url: "https://sqlbolt.com/" },
                    "postgres": { title: "PostgreSQL Database Administration Guide", url: "https://www.postgresql.org/docs/" },
                    "prisma": { title: "Prisma Schema & ORM Guided Tutorial", url: "https://www.prisma.io/docs" },
                    "tailwind": { title: "Tailwind CSS Layouts & Components", url: "https://tailwindcss.com/docs" }
                  };

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {missingSkills.map((skill) => {
                        const normSkill = skill.toLowerCase();
                        const recommendation = courseDirectory[normSkill] || {
                          title: `${skill} Professional Reference Guide`,
                          url: `https://www.google.com/search?q=${encodeURIComponent(skill + " documentation developer course")}`
                        };

                        return (
                          <div key={skill} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between min-h-[300px]">
                            <div>
                              <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[9px] font-black uppercase tracking-widest border border-red-500/20">Missing Skill Gaps</span>
                                <span className="text-[8px] font-bold text-[#7a6040] uppercase tracking-widest truncate max-w-[150px]">Required by {skillSources[skill]?.length || 1} roles</span>
                              </div>
                              <h4 className="text-2xl font-black text-[#2d2013] tracking-tighter mb-2">{skill}</h4>
                              <p className="text-[10px] text-[#7a6040]/70 font-bold uppercase tracking-wider mb-4 leading-relaxed">
                                Sources: {skillSources[skill]?.join(", ")}
                              </p>
                              <div className="p-4 bg-[#2d2013]/5 rounded-2xl border border-[#cfc3a0]/30 mb-6 flex justify-between items-center group/btn cursor-pointer" onClick={() => window.open(recommendation.url, '_blank')}>
                                <div>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-[#cb4b16] mb-0.5">Recommended Coursework</p>
                                  <p className="text-xs font-black text-[#2d2013] truncate max-w-[200px]">{recommendation.title}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-[#cb4b16] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              </div>
                            </div>

                            <div className="relative">
                              <input 
                                type="file" 
                                id={`upload-cert-${skill}`} 
                                className="hidden" 
                                accept="image/*,.pdf" 
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                      setSaveLoading(true);
                                      try {
                                        const mockProject = {
                                          id: "",
                                          title: `Verified Certificate: ${skill}`,
                                          description: `Successfully completed verified professional training in ${skill} to bridge required technical skill gaps.`,
                                          evidenceLink: reader.result as string
                                        };
                                        const res = await fetch("/api/projects", { 
                                          method: "POST", 
                                          headers: { "Content-Type": "application/json" }, 
                                          body: JSON.stringify(mockProject) 
                                        });
                                        if (res.ok) {
                                          fetchProfile();
                                          alert(`Congratulations! You have verified your ${skill} certificate and bridged this skill gap.`);
                                        }
                                      } catch (err) { console.error(err); } finally { setSaveLoading(false); }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label htmlFor={`upload-cert-${skill}`} className="w-full py-4 bg-[#2d2013] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#cb4b16] hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md">
                                <Upload className="w-4 h-4" /> Verify Certificate & Resolve Gap
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "personal" && (
              <motion.div key="personal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Profile Strength Momentum */}
                <div className="max-w-2xl bg-[#2d2013] rounded-[2.5rem] p-8 text-[#fdf6e3] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-1">Profile Momentum</p>
                        <h3 className="text-2xl font-black tracking-tighter">Your Intelligence Score</h3>
                      </div>
                      <span className="text-4xl font-black text-[#cb4b16]">{calculateProfileStrength()}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${calculateProfileStrength()}%` }} 
                        className="h-full bg-[#cb4b16] shadow-[0_0_20px_rgba(203,75,22,0.5)]"
                      />
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-[#eee8d5]/60 italic">
                      {calculateProfileStrength() < 100 ? "Add more achievements and social links to unlock Top 1% visibility." : "Your profile is at peak visibility. Recruiters are being notified."}
                    </p>
                  </div>
                </div>

                <div className="max-w-2xl bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-10 shadow-sm">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Username</label>
                        <input value={personalData.username} onChange={(e) => setPersonalData({...personalData, username: e.target.value})} className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Location</label>
                        <input value={personalData.location} onChange={(e) => setPersonalData({...personalData, location: e.target.value})} className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1 flex items-center gap-2"><Globe className="w-3 h-3" /> GitHub URL</label>
                        <input value={personalData.githubUrl} onChange={(e) => setPersonalData({...personalData, githubUrl: e.target.value})} placeholder="https://github.com/..." className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1 flex items-center gap-2"><Users className="w-3 h-3" /> LinkedIn URL</label>
                        <input value={personalData.linkedinUrl} onChange={(e) => setPersonalData({...personalData, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Bio / Mission Statement</label>
                      <textarea rows={4} value={personalData.bio} onChange={(e) => setPersonalData({...personalData, bio: e.target.value})} className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold resize-none" />
                    </div>
                    <button onClick={() => handleUpdate(personalData)} className="w-full py-5 rounded-2xl bg-[#2d2013] text-[#fdf6e3] font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-xl">Update Identity</button>
                  </div>
                </div>
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "qualifications" && (
              <motion.div key="dossier" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
                {/* Academic & Resume Section */}
                <div className="bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-[14px]">Academic Foundation</h3>
                      <p className="text-[10px] text-[#7a6040] font-bold uppercase opacity-60">Manage your educational background and official resume.</p>
                    </div>
                    <div className="relative">
                      <input type="file" id="resume-upload" className="hidden" accept=".pdf" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setQualData({ ...qualData, resumeUrl: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }} />
                      <label htmlFor="resume-upload" className="px-6 py-3 bg-[#2d2013] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#cb4b16] transition-all cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" /> {qualData.resumeUrl ? "Update Resume" : "Upload Resume (PDF)"}
                      </label>
                    </div>
                  </div>
 
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">College / University</label>
                        <input value={qualData.college} onChange={(e) => setQualData({...qualData, college: e.target.value})} placeholder="e.g. MVJ College of Engineering" className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                      <div className="col-span-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">CGPA</label>
                        <input type="number" step="0.01" value={qualData.cgpa} onChange={(e) => setQualData({...qualData, cgpa: e.target.value})} placeholder="e.g. 9.2" className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Schooling (10th/12th Grade or High School)</label>
                      <input value={qualData.school} onChange={(e) => setQualData({...qualData, school: e.target.value})} placeholder="e.g. St. Xavier High School, CBSE Board" className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:ring-2 focus:ring-[#cb4b16]/20 transition-all text-sm font-bold" />
                    </div>
                    {qualData.resumeUrl && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Resume Verified & Loaded ✓</span>
                      </div>
                    )}
                    <button onClick={() => handleUpdate(qualData)} className="w-full py-5 rounded-2xl bg-[#cb4b16] text-[#fdf6e3] font-black uppercase tracking-widest text-xs hover:scale-[1.01] transition-all shadow-xl">Save Academic Foundation</button>
                  </div>
                </div>
 
                {/* Achievements Section */}
                <div className="bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-[14px]">Add New Achievement</h3>
                      <p className="text-[10px] text-[#7a6040] font-bold uppercase opacity-60">Add hackathons, certifications, or milestones with verified proof.</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="file" 
                        id="cert-upload" 
                        className="hidden" 
                        accept="image/*,.pdf" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewProject({ ...newProject, evidenceLink: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      <label htmlFor="cert-upload" className="px-5 py-2.5 bg-[#2d2013] text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-md hover:bg-[#cb4b16] transition-all cursor-pointer flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" /> {newProject.evidenceLink ? "Update Certificate Proof" : "Upload Certificate Proof"}
                      </label>
                    </div>
                  </div>

                  {newProject.evidenceLink && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Certificate / Proof Attached ✓</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Achievement Title</label>
                      <input value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="e.g. Hackathon Winner, Open Source Lead..." className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] px-1">Description</label>
                      <input value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="Briefly describe your impact..." className="w-full p-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] text-sm font-bold" />
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (!newProject.title) return;
                      setSaveLoading(true);
                      try {
                        const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProject) });
                        if (res.ok) {
                          setNewProject({ id: "", title: "", description: "", evidenceLink: "" });
                          fetchProfile();
                          alert("Achievement Added!");
                        }
                      } catch (e) { console.error(e); } finally { setSaveLoading(false); }
                    }} 
                    className="w-full py-5 rounded-2xl bg-[#2d2013] text-[#fdf6e3] font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-md"
                  >
                    Lock Achievement to Profile
                  </button>
                </div>
 
                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData?.studentProfile?.projects?.map((p: any) => (
                    <div key={p.id} className="p-6 bg-white/60 border border-[#cfc3a0] rounded-3xl shadow-sm group relative flex flex-col justify-between h-full">
                      <div>
                        <button 
                          onClick={async () => {
                            if (!confirm("Remove this achievement?")) return;
                            try {
                              const res = await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
                              if (res.ok) fetchProfile();
                            } catch (e) { console.error(e); }
                          }}
                          className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-[#2d2013] text-white flex items-center justify-center mb-4"><Trophy className="w-4 h-4" /></div>
                        <h4 className="text-sm font-black tracking-tight mb-1">{p.title}</h4>
                        <p className="text-[10px] text-[#7a6040] leading-relaxed line-clamp-3 mb-4">{p.description}</p>
                      </div>
                      {p.evidenceLink && (
                        <a 
                          href={p.evidenceLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full py-2 bg-green-500/10 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all text-green-700 rounded-xl text-center text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 mt-auto shadow-sm"
                        >
                          <FileText className="w-3 h-3" /> View Proof Certificate
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {userRole === "RECRUITER" && activeTab === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData?.recruiterProfile?.jobs?.map((job: any) => (
                  <div key={job.id} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] flex flex-col shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-[#cb4b16]/10 text-[#cb4b16]"><Briefcase className="w-6 h-6" /></div>
                        {job.applications?.filter((a: any) => a.status === "PENDING").length > 0 && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="px-3 py-1 bg-[#cb4b16] text-white text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(203,75,22,0.4)] animate-pulse"
                          >
                            {job.applications?.filter((a: any) => a.status === "PENDING").length} NEW
                          </motion.div>
                        )}
                      </div>
                      <button onClick={() => handleDeleteJob(job.id)} className="p-2 rounded-xl bg-red-500/10 text-red-600 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-lg font-black tracking-tight mb-2">{job.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#7a6040] uppercase tracking-widest mb-8">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applications?.length || 0}</span>
                    </div>
                    <button onClick={() => fetchApplicants(job.id)} className="w-full py-4 rounded-2xl bg-[#2d2013] text-[#fdf6e3] font-black uppercase tracking-widest text-[10px] hover:bg-[#cb4b16] transition-all shadow-md">View Applicants</button>
                  </div>
                ))}
              </motion.div>
            )}

            {userRole === "RECRUITER" && activeTab === "talent" && (
              <motion.div key="talent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talentPool?.map((student: any) => (
                  <div key={student.id} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Remove this student from your talent pool?")) {
                            let hiddenIds: string[] = [];
                            try {
                              const hiddenRaw = localStorage.getItem("hidden_talent_pool");
                              if (hiddenRaw) hiddenIds = JSON.parse(hiddenRaw);
                            } catch (err) { console.error(err); }
                            hiddenIds.push(student.id);
                            localStorage.setItem("hidden_talent_pool", JSON.stringify(hiddenIds));
                            setTalentPool(talentPool.filter((s: any) => s.id !== student.id));
                          }
                        }}
                        className="p-2 bg-red-500/10 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-widest border border-green-500/20">
                        <ShieldCheck className="w-2 h-2" /> Verified
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-[2rem] bg-[#2d2013] text-white flex items-center justify-center text-2xl font-black shadow-xl ring-4 ring-[#cb4b16]/10">{student.name?.[0]}</div>
                      <div>
                        <h4 className="text-lg font-black tracking-tighter text-[#2d2013]">{student.name}</h4>
                        <p className="text-[10px] font-black text-[#cb4b16] uppercase tracking-widest">{student.studentProfile?.college}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="px-3 py-1 rounded-full bg-[#2d2013]/5 text-[#2d2013] text-[8px] font-black uppercase tracking-widest">Top {(student.name?.length || 5) % 10 + 1}% Dev</span>
                      <span className="px-3 py-1 rounded-full bg-[#cb4b16]/5 text-[#cb4b16] text-[8px] font-black uppercase tracking-widest">{student.studentProfile?.projects?.length || 0} Achievements</span>
                    </div>

                    <p className="text-xs text-[#7a6040] line-clamp-3 mb-10 leading-relaxed font-medium">"{student.studentProfile?.bio || "A verified SkillBridge professional ready for high-impact roles."}"</p>
                    
                    <button 
                      onClick={() => setViewingProfile({ user: student })} 
                      className="mt-auto w-full py-5 rounded-[1.5rem] bg-[#2d2013] text-[#fdf6e3] font-black uppercase tracking-widest text-[10px] hover:bg-[#cb4b16] transition-all shadow-lg"
                    >
                      Analyze Full Dossier
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-[#2d2013]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#fdf6e3] w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden">
              <button onClick={() => setSelectedJob(null)} className="absolute top-8 right-8 p-3 bg-white rounded-2xl shadow-sm text-[#7a6040] hover:text-[#cb4b16] transition-all hover:rotate-90 z-20"><X className="w-6 h-6" /></button>
              
              <div className="mb-10 flex-shrink-0">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Management</p>
                <h3 className="text-3xl font-black tracking-tighter">Reviewing Applicants</h3>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex flex-col flex-1 overflow-hidden">
                {/* Advanced Filter Suite */}
                <div className="p-10 bg-[#2d2013] rounded-[3rem] text-[#fdf6e3] shadow-2xl relative overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 right-0 p-12 opacity-5"><Sparkles className="w-48 h-48 rotate-12" /></div>
                  <div className="relative z-10">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Discovery Intelligence</p>
                    <h3 className="text-3xl font-black tracking-tighter mb-8">Filter Applicants</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Min CGPA</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 8.0" 
                          value={filters.minCgpa} 
                          onChange={(e) => setFilters({...filters, minCgpa: e.target.value})} 
                          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-[#cb4b16] transition-all font-bold text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">College Keyword / Tier</label>
                        <input 
                          type="text" 
                          placeholder="e.g. IIT, MIT..." 
                          value={filters.collegeKeyword} 
                          onChange={(e) => setFilters({...filters, collegeKeyword: e.target.value})} 
                          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-[#cb4b16] transition-all font-bold text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Intelligent Skill Search</label>
                        <input 
                          type="text" 
                          placeholder="e.g. AIML, Frontend..." 
                          value={filters.skillKeywords} 
                          onChange={(e) => setFilters({...filters, skillKeywords: e.target.value})} 
                          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-[#cb4b16] transition-all font-bold text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                {getFilteredApplicants()?.length === 0 ? (
                  <div className="md:col-span-2 py-20 bg-white/40 border border-dashed border-[#cfc3a0] rounded-[2.5rem] text-center">
                    <p className="font-bold text-[#7a6040]">No applicants match these filters.</p>
                  </div>
                ) : (
                  getFilteredApplicants()?.map((app, index) => (
                    <div key={app.id} className="p-6 bg-white/60 border border-[#cfc3a0] rounded-[2rem] shadow-sm flex items-center justify-between group hover:shadow-xl transition-all relative overflow-hidden">
                      {index < 3 && (
                        <div className="absolute top-0 left-0 px-3 py-1 bg-[#cb4b16] text-white text-[8px] font-black uppercase tracking-widest rounded-br-xl shadow-lg">
                          Rank #{index + 1} • Top Priority
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:bg-[#cb4b16] transition-colors">{app.user.name?.[0]}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-[#2d2013] tracking-tight">{app.user.name}</p>
                            <span className="text-[10px] font-black text-[#cb4b16] bg-[#cb4b16]/10 px-2 py-0.5 rounded-full">{Math.round(app.aiScore)}% Match</span>
                          </div>
                          <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block ${
                            app.status === "SHORTLISTED" ? "bg-green-500/10 text-green-600" : 
                            app.status === "REJECTED" ? "bg-red-500/10 text-red-600" : 
                            "bg-[#cb4b16]/10 text-[#cb4b16]"
                          }`}>
                            {app.status}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {app.status === "PENDING" && (
                          <>
                            <button onClick={() => updateApplicationStatus(app.id, "SHORTLISTED")} className="p-3 bg-green-500 text-white rounded-xl shadow-lg hover:scale-110 transition-all"><Plus className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedAppForRejection(app); setIsRejectionModalOpen(true); }} className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 transition-all"><X className="w-4 h-4" /></button>
                          </>
                        )}
                        <button onClick={() => setViewingProfile(app)} className="p-3 bg-[#2d2013] text-white rounded-xl shadow-lg hover:bg-[#cb4b16] transition-all"><UserIcon className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

        {viewingJob && (
          <div className="fixed inset-0 bg-[#2d2013]/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#fdf6e3] w-full max-w-4xl rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]">
              <button onClick={() => { setViewingJob(null); setIsModalTechExpanded(false); }} className="absolute top-6 right-6 p-2 text-[#7a6040] hover:text-[#cb4b16] z-[210] bg-white/80 rounded-full shadow-sm transition-all hover:rotate-90"><X className="w-6 h-6" /></button>
              <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-24 h-24 rounded-3xl bg-[#2d2013] text-white flex items-center justify-center text-4xl font-black shadow-xl">{viewingJob.recruiterProfile?.companyName?.[0] || "S"}</div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">{viewingJob.recruiterProfile?.companyName || "Verified Partner"}</p>
                    <h2 className="text-5xl font-black tracking-tighter leading-none">{viewingJob.title}</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-6 bg-white rounded-[2rem] border border-[#cfc3a0] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-2">Role Intelligence</p>
                        <p className="font-bold text-[#2d2013] text-sm md:text-base">{viewingJob.type || viewingJob.jobType}</p>
                      </div>
                      <div className="p-6 bg-white rounded-[2rem] border border-[#cfc3a0] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-2">Hiring Location</p>
                        <p className="font-bold text-[#2d2013] text-sm md:text-base">{viewingJob.location}</p>
                      </div>
                      <div className="p-6 bg-white rounded-[2rem] border border-[#cfc3a0] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-2">Comp/Salary</p>
                        <p className="font-bold text-green-700 text-sm md:text-base">{viewingJob.salary || "Not Specified"}</p>
                      </div>
                      <div className="p-6 bg-white rounded-[2rem] border border-[#cfc3a0] shadow-sm flex flex-col justify-between min-h-[120px] max-h-[160px] overflow-y-auto custom-scrollbar">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-2">Tech Stack</p>
                        {viewingJob.requirements ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(() => {
                              const reqs = viewingJob.requirements.split(',');
                              if (reqs.length <= 1 || isModalTechExpanded) {
                                return reqs.map((req: string, i: number) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-[#cb4b16]/5 border border-[#cb4b16]/10 text-[#cb4b16] text-[10px] font-black uppercase tracking-widest">{req.trim()}</span>
                                ));
                              } else {
                                return (
                                  <>
                                    <span className="px-2 py-0.5 rounded-md bg-[#cb4b16]/5 border border-[#cfc3a0] text-[#7a6040] text-[10px] font-black uppercase tracking-widest">{reqs[0].trim()}</span>
                                    <button 
                                      onClick={() => setIsModalTechExpanded(true)}
                                      className="px-2 py-0.5 rounded-md bg-[#cb4b16] text-white text-[10px] font-black hover:bg-[#cb4b16]/80 transition-all shadow-sm cursor-pointer"
                                    >
                                      ...
                                    </button>
                                  </>
                                );
                              }
                            })()}
                          </div>
                        ) : (
                          <p className="font-bold text-[#2d2013] text-sm">Not Specified</p>
                        )}
                      </div>
                    </div>
                    
                    <section>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-6 flex items-center gap-2"><Sparkles className="w-3 h-3 text-[#cb4b16]" /> Mission & Description</h4>
                      <p className="text-xl text-[#2d2013] leading-relaxed font-medium whitespace-pre-wrap opacity-90">{viewingJob.description}</p>
                    </section>
                  </div>

                  <div className="space-y-6">
                    {/* Recruiter Spotlight Card */}
                    <div className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-8">Recruiter Spotlight</h4>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center text-xl font-black">{viewingJob.recruiterProfile?.user?.name?.[0]}</div>
                        <div>
                          <p className="text-sm font-black tracking-tight">{viewingJob.recruiterProfile?.user?.name}</p>
                          <p className="text-[10px] font-black text-[#7a6040] uppercase tracking-widest">{viewingJob.recruiterProfile?.designation || "Hiring Manager"}</p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-[#cfc3a0]/30">
                        <p className="text-[8px] font-black text-[#cb4b16] uppercase tracking-widest mb-1">Company Status</p>
                        <p className="text-xs font-bold text-[#2d2013]">{viewingJob.recruiterProfile?.companyName} Verified ✓</p>
                      </div>
                    </div>

                    <div className="p-8 bg-[#cb4b16]/5 border border-[#cb4b16]/10 rounded-[2.5rem]">
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#cb4b16] mb-4">Discovery Metrics</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#7a6040]">Applicants</span>
                          <span className="text-[10px] font-black text-[#2d2013]">{viewingJob.applications?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#7a6040]">Recruiter Activity</span>
                          <span className="text-[10px] font-black text-green-600">HIGH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-white border-t border-[#cfc3a0] flex items-center justify-between gap-8">
                <div className="text-left hidden md:block">
                  <p className="text-[10px] font-black text-[#7a6040] uppercase tracking-widest mb-1">Final Step</p>
                  <p className="text-xs font-bold text-[#2d2013]">Deploy your professional evidence to this role.</p>
                </div>
                <div className="flex-1 max-w-md bg-[#2d2013] text-white py-5 rounded-3xl font-black uppercase tracking-widest text-center shadow-2xl hover:bg-[#cb4b16] hover:scale-[1.02] transition-all cursor-pointer text-xs" onClick={() => { handleApply(viewingJob.id); setViewingJob(null); setIsModalTechExpanded(false); }}>
                  Apply
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {viewingProfile && (
          <div className="fixed inset-0 bg-[#2d2013]/70 backdrop-blur-md z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#fdf6e3] w-full max-w-6xl rounded-[3rem] shadow-2xl relative flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
              <button onClick={() => setViewingProfile(null)} className="absolute top-6 right-6 p-2 text-[#7a6040] hover:text-[#cb4b16] z-[160] bg-white/80 rounded-full shadow-sm transition-all hover:rotate-90"><X className="w-6 h-6" /></button>
              
              {/* Main Dossier Content */}
              <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar space-y-12 bg-white/40">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 rounded-full bg-[#2d2013] flex items-center justify-center text-white text-3xl font-black ring-4 ring-[#cb4b16]/20">
                    {viewingProfile.user?.name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">{viewingProfile.user?.name}</h2>
                    <p className="text-[#cb4b16] font-bold uppercase tracking-widest text-[10px] mb-2">{viewingProfile.user?.studentProfile?.college || "SkillBridge Verified"}</p>
                    <div className="flex gap-2">
                      {viewingProfile.user?.studentProfile?.githubUrl && (
                        <a href={viewingProfile.user.studentProfile.githubUrl.startsWith('http') ? viewingProfile.user.studentProfile.githubUrl : `https://${viewingProfile.user.studentProfile.githubUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#2d2013] text-white rounded-lg hover:scale-110 transition-transform shadow-sm" title="GitHub">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {viewingProfile.user?.studentProfile?.linkedinUrl && (
                        <a href={viewingProfile.user.studentProfile.linkedinUrl.startsWith('http') ? viewingProfile.user.studentProfile.linkedinUrl : `https://${viewingProfile.user.studentProfile.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0077b5] text-white rounded-lg hover:scale-110 transition-transform shadow-sm" title="LinkedIn">
                          <Users className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-6 flex items-center gap-2"><UserIcon className="w-3 h-3" /> Mission Statement</h4>
                  <p className="text-lg text-[#2d2013] leading-relaxed font-medium opacity-90">{viewingProfile.user?.studentProfile?.bio || "A verified professional ready for high-impact roles."}</p>
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-6 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Professional Evidence</h4>
                  {viewingProfile.user?.studentProfile?.resumeUrl ? (
                    <div className="p-6 bg-white border border-[#cfc3a0] rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 text-red-600 rounded-xl"><FileText className="w-6 h-6" /></div>
                        <div>
                          <p className="font-black text-sm text-[#2d2013]">Official Resume.pdf</p>
                          <p className="text-[10px] font-bold text-[#7a6040]">Verified Professional Document</p>
                        </div>
                      </div>
                      <a href={viewingProfile.user?.studentProfile?.resumeUrl} download className="px-6 py-3 bg-[#2d2013] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#cb4b16] transition-all">Download</a>
                    </div>
                  ) : (
                    <div className="p-10 bg-white/40 border border-dashed border-[#cfc3a0] rounded-3xl text-center text-xs font-bold text-[#7a6040]">No resume attached.</div>
                  )}
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-8 flex items-center gap-2"><Trophy className="w-3 h-3" /> Achievement Gallery</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(viewingProfile.user?.studentProfile?.projects || []).map((p: any) => (
                      <div key={p.id} className="p-6 bg-white border border-[#cfc3a0] rounded-3xl shadow-sm">
                        <h5 className="font-black text-sm mb-2">{p.title}</h5>
                        <p className="text-[10px] text-[#7a6040] leading-relaxed line-clamp-3">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* AI Insights Sidebar */}
              <div className="w-full md:w-96 bg-[#eee8d5]/60 border-l border-[#cfc3a0] p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Neural Intelligence Profile</p>
                  <h3 className="text-xl font-black text-[#2d2013] tracking-tighter">Insights Dashboard</h3>
                </div>

                {/* Animated Skill Radar */}
                <div className="h-64 bg-white rounded-[3rem] shadow-sm flex items-center justify-center relative group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-90 transition-transform duration-1000"><Sparkles className="w-16 h-16" /></div>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                       <circle cx="96" cy="96" r="80" stroke="#fdf6e3" strokeWidth="16" fill="transparent" />
                       <motion.circle 
                         cx="96" cy="96" r="80" 
                         stroke="#cb4b16" 
                         strokeWidth="16" 
                         fill="transparent" 
                         strokeDasharray="503" 
                         initial={{ strokeDashoffset: 503 }}
                         animate={{ 
                           strokeDashoffset: 503 - (503 * (
                             selectedJob 
                               ? calculateJobMatchScore(viewingProfile.user?.studentProfile, selectedJob) / 100 
                               : calculateProfileStrengthForStudent(viewingProfile.user?.studentProfile) / 100
                           )) 
                         }}
                         transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                         strokeLinecap="round"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <motion.span 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 1 }}
                         className="text-5xl font-black tracking-tighter text-[#2d2013]"
                       >
                         {selectedJob 
                           ? calculateJobMatchScore(viewingProfile.user?.studentProfile, selectedJob) 
                           : calculateProfileStrengthForStudent(viewingProfile.user?.studentProfile)}%
                       </motion.span>
                       <span className="text-[10px] font-black text-[#cb4b16] uppercase tracking-[0.2em] mt-1">
                         {selectedJob ? "Job Match" : "Profile Strength"}
                       </span>
                     </div>
                  </div>
                </div>

                {/* AI Evidence Bullets */}
                <div className="space-y-6">
                  <div className="p-8 bg-[#2d2013] text-[#fdf6e3] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -bottom-4 -right-4 opacity-10"><Terminal className="w-24 h-24" /></div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-6 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Talent Signals
                    </h4>
                    <ul className="space-y-4">
                      {[
                        { label: "Execution Strength", text: (viewingProfile.user?.studentProfile?.projects?.length || 0) > 1 ? "High-velocity builder with verified project history." : "Developing technical foundation with clear potential." },
                        { label: "Evidence Density", text: viewingProfile.user?.studentProfile?.resumeUrl ? "Rich evidence found in verified documentation." : "Profile relies on self-reported achievements." },
                        { label: "Communication", text: (viewingProfile.user?.studentProfile?.bio?.length || 0) > 50 ? "Articulate mission statement aligns with culture." : "Succinct communication style identified." }
                      ].map((signal, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + (i * 0.2) }}
                          className="flex gap-3"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#cb4b16] mt-1 shrink-0" />
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#cb4b16] mb-0.5">{signal.label}</p>
                            <p className="text-[11px] leading-relaxed font-medium opacity-80">{signal.text}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  {selectedJob && (() => {
                    const activeJobObj = jobs.find((j: any) => j.id === selectedJob);
                    if (!activeJobObj) return null;
                    const gaps = getMissingSkills(viewingProfile.user?.studentProfile, activeJobObj);
                    return (
                      <div className="p-8 bg-red-500/10 border border-red-500/20 text-[#2d2013] rounded-[2.5rem] shadow-inner relative overflow-hidden">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2">
                          <Target className="w-3 h-3 text-red-600" /> Job Requirement Gaps
                        </h4>
                        {gaps.length === 0 ? (
                          <p className="text-xs font-bold text-green-700">Satisfies all requirements for this role! ✓</p>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-[10px] text-[#7a6040] font-bold leading-relaxed">This candidate is missing the following stack requirements specified for the {activeJobObj.title} role:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {gaps.map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {userRole === "RECRUITER" && viewingProfile?.status === "PENDING" && (
                  <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[#cfc3a0]/30">
                    <button 
                      onClick={() => { updateApplicationStatus(viewingProfile.id, "SHORTLISTED"); setViewingProfile(null); }} 
                      className="w-full py-5 rounded-3xl bg-[#cb4b16] text-white font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Quick Hire
                    </button>
                    <button 
                      onClick={() => { setSelectedAppForRejection(viewingProfile); setIsRejectionModalOpen(true); setViewingProfile(null); }} 
                      className="w-full py-5 rounded-3xl bg-white text-[#2d2013] border border-[#cfc3a0] font-black uppercase tracking-widest text-xs hover:bg-[#2d2013] hover:text-white transition-all"
                    >
                      Analyze & Pass
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
        {isRejectionModalOpen && (
          <div className="fixed inset-0 bg-[#2d2013]/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#fdf6e3] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative">
              <button onClick={() => setIsRejectionModalOpen(false)} className="absolute top-8 right-8 p-2 text-[#7a6040] hover:text-[#cb4b16]"><X className="w-6 h-6" /></button>
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Rejection Intelligence</p>
                <h3 className="text-3xl font-black tracking-tighter">Bridge the Gap</h3>
                <p className="text-xs text-[#7a6040] font-bold mt-2">Provide constructive feedback to help {selectedAppForRejection?.user?.name} grow.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Quick Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { skill: "React", course: "https://react.dev" },
                      { skill: "Next.js", course: "https://nextjs.org/learn" },
                      { skill: "TypeScript", course: "https://www.typescriptlang.org/docs/" },
                      { skill: "Tailwind", course: "https://tailwindcss.com/docs" },
                      { skill: "Prisma", course: "https://www.prisma.io/docs" },
                      { skill: "PostgreSQL", course: "https://www.postgresql.org/docs/" }
                    ].map((preset) => (
                      <button 
                        key={preset.skill}
                        onClick={() => {
                          const currentSkills = rejectionForm.skills ? rejectionForm.skills.split(',').map(s => s.trim()) : [];
                          if (!currentSkills.includes(preset.skill)) {
                            setRejectionForm({
                              ...rejectionForm,
                              skills: rejectionForm.skills ? `${rejectionForm.skills}, ${preset.skill}` : preset.skill,
                              courses: rejectionForm.courses ? `${rejectionForm.courses}, ${preset.course}` : preset.course
                            });
                          }
                        }}
                        className="px-3 py-1 bg-[#2d2013]/5 text-[#2d2013] text-[8px] font-black uppercase tracking-widest rounded-full hover:bg-[#cb4b16] hover:text-white transition-all"
                      >
                        + {preset.skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Feedback Note</label>
                  <textarea 
                    value={rejectionForm.feedback} 
                    onChange={(e) => setRejectionForm({...rejectionForm, feedback: e.target.value})}
                    placeholder="Why was this application not a fit?"
                    className="w-full p-4 rounded-2xl bg-white border border-[#cfc3a0] text-sm font-bold resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Missing Skills (Comma separated)</label>
                  <input 
                    value={rejectionForm.skills} 
                    onChange={(e) => setRejectionForm({...rejectionForm, skills: e.target.value})}
                    placeholder="React, TypeScript, SQL..."
                    className="w-full p-4 rounded-2xl bg-white border border-[#cfc3a0] text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Suggested Learning (Course URL)</label>
                  <input 
                    value={rejectionForm.courses} 
                    onChange={(e) => setRejectionForm({...rejectionForm, courses: e.target.value})}
                    placeholder="https://..."
                    className="w-full p-4 rounded-2xl bg-white border border-[#cfc3a0] text-sm font-bold"
                  />
                </div>
                <button 
                  onClick={() => {
                    const courseList = rejectionForm.courses.split(',').map(url => ({
                      title: "Learning Resource",
                      url: url.trim()
                    })).filter(c => c.url);
                    
                    updateApplicationStatus(selectedAppForRejection.id, "REJECTED", {
                      rejectionFeedback: rejectionForm.feedback,
                      skillGaps: rejectionForm.skills,
                      suggestedCourses: JSON.stringify(courseList)
                    });
                  }}
                  className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-red-600 transition-all"
                >
                  Confirm Rejection & Send Intelligence
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {viewingSkillGap && (
          <div className="fixed inset-0 bg-[#2d2013]/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#fdf6e3] w-full max-w-3xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5"><Target className="w-48 h-48" /></div>
              <button onClick={() => setViewingSkillGap(null)} className="absolute top-8 right-8 p-2 text-[#7a6040] hover:text-[#cb4b16] z-10"><X className="w-6 h-6" /></button>
              
              <div className="relative z-10">
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cb4b16] mb-2">Skill-Gap Intelligence Report</p>
                  <h3 className="text-4xl font-black tracking-tighter leading-tight">Your Path to <span className="text-[#cb4b16]">Success.</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-4">Recruiter's Perspective</h4>
                      <p className="text-sm font-bold text-[#2d2013] leading-relaxed italic bg-white/40 p-6 rounded-2xl border border-[#cfc3a0]">"{viewingSkillGap.rejectionFeedback || "No specific feedback provided, but we suggest focusing on the skills below."}"</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-4">Identified Skill Gaps</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingSkillGap.skillGaps?.split(',').map((skill: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-red-500/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">{skill.trim()}</span>
                        )) || <span className="text-xs font-bold opacity-50">General technical refinement suggested.</span>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-4">Recommended Learning</h4>
                      <div className="space-y-3">
                        {JSON.parse(viewingSkillGap.suggestedCourses || "[]").map((course: any, i: number) => (
                          <a key={i} href={course.url} target="_blank" className="flex items-center justify-between p-4 bg-[#2d2013] text-white rounded-2xl group hover:bg-[#cb4b16] transition-all">
                            <span className="text-[10px] font-black uppercase tracking-widest">{course.title}</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-[2rem]">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Re-apply Window</h4>
                      </div>
                      <p className="text-[10px] font-bold text-[#7a6040]">You can re-apply for roles at {viewingSkillGap.job?.recruiterProfile?.companyName} after <span className="text-[#2d2013]">{new Date(viewingSkillGap.reapplyDate || Date.now()).toLocaleDateString()}</span>. Focus on your growth until then!</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
