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
  Users
} from "lucide-react";

type DashboardTab = "overview" | "marketplace" | "applications" | "talent" | "personal" | "qualifications" | "portfolio" | "company" | "listings";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [userData, setUserData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form States
  const [personalData, setPersonalData] = useState({ dob: "", location: "", bio: "", username: "" });
  const [qualData, setQualData] = useState({ college: "", school: "", resumeUrl: "" });
  const [newProject, setNewProject] = useState({ id: "", title: "", description: "" });
  const [recruiterData, setRecruiterData] = useState({ companyName: "", designation: "", publicBio: "" });
  const [newJob, setNewJob] = useState({ title: "", type: "Full-time", location: "", description: "" });
  const [viewingJob, setViewingJob] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [talentPool, setTalentPool] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [marketplaceJobs, setMarketplaceJobs] = useState<any[]>([]);

  const userRole = (session?.user as any)?.role || "STUDENT";

  const router = useRouter();

  const fetchProfile = async () => {
    if (session?.user?.email) {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        
        // If they have a profile but haven't filled in the key info (College or Company), send them to onboarding!
        const isStudentEmpty = data.studentProfile && !data.studentProfile.college;
        const isRecruiterEmpty = data.recruiterProfile && !data.recruiterProfile.companyName;

        if (!data.studentProfile && !data.recruiterProfile) {
          router.push("/onboarding");
          return;
        }

        if (isStudentEmpty || isRecruiterEmpty) {
          router.push("/onboarding");
          return;
        }

        if (res.ok) {
          setUserData(data);
          if (data.studentProfile) {
            setPersonalData({ 
              dob: data.studentProfile.dob?.split('T')[0] || "", 
              location: data.studentProfile.location || "",
              bio: data.studentProfile.bio || "",
              username: data.username || "" 
            });
            setQualData({ college: data.studentProfile.college || "", school: data.studentProfile.school || "", resumeUrl: data.studentProfile.resumeUrl || "" });
          }
          if (data.recruiterProfile) {
            setRecruiterData({ companyName: data.recruiterProfile.companyName || "", designation: data.recruiterProfile.designation || "", publicBio: data.recruiterProfile.publicBio || "" });
            const jRes = await fetch("/api/jobs");
            const jData = await jRes.json();
            if (Array.isArray(jData)) setJobs(jData);
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
    console.log("Applying for job:", jobId);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      console.log("Apply response:", data);
      
      if (res.ok) {
        alert("Application sent successfully!");
        fetchMarketplace();
        fetchMyApplications();
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (e) { 
      console.error("Apply error:", e);
      alert("Error sending application");
    }
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
      if (res.ok && Array.isArray(data)) setTalentPool(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { 
    fetchProfile(); 
    if (userRole === "STUDENT") {
      fetchMarketplace();
      fetchMyApplications();
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

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchApplicants(selectedJob);
      }
    } catch (e) { console.error(e); }
  };

  const handlePostJob = async () => {
    if (!newJob.title) return;
    setSaveLoading(true);
    try {
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newJob.title, jobType: newJob.type, location: newJob.location, description: newJob.description }) });
      if (res.ok) {
        setNewJob({ title: "", type: "Full-time", location: "", description: "" });
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

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Remove this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchProfile();
    } catch (e) { console.error(e); }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#2d2013] font-sans selection:bg-[#cb4b16]/20">
      
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#eee8d5] border-r border-[#cfc3a0] hidden lg:flex flex-col p-6 z-50">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-[#cb4b16] flex items-center justify-center shadow-lg"><div className="w-2 h-2 bg-[#fdf6e3] rounded-full" /></div>
          <span className="font-bold text-lg tracking-tighter">SkillBridge</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          {userRole === "STUDENT" && (
            <>
              <NavItem icon={<Globe className="w-4 h-4" />} label="Marketplace" active={activeTab === "marketplace"} onClick={() => setActiveTab("marketplace")} />
              <NavItem icon={<FileText className="w-4 h-4" />} label="My Applications" active={activeTab === "applications"} onClick={() => setActiveTab("applications")} />
            </>
          )}
          <div className="pt-4 pb-2">
            <p className="text-[10px] font-black text-[#7a6040] uppercase tracking-widest px-4 mb-2">{userRole === "STUDENT" ? "Build Profile" : "Company Profile"}</p>
            {userRole === "STUDENT" ? (
              <>
                <NavItem icon={<UserIcon className="w-4 h-4" />} label="Personal Info" active={activeTab === "personal"} onClick={() => setActiveTab("personal")} />
                <NavItem icon={<GraduationCap className="w-4 h-4" />} label="Qualifications" active={activeTab === "qualifications"} onClick={() => setActiveTab("qualifications")} />
                <NavItem icon={<Briefcase className="w-4 h-4" />} label="Portfolio" active={activeTab === "portfolio"} onClick={() => setActiveTab("portfolio")} />
              </>
            ) : (
              <>
                <NavItem icon={<Building className="w-4 h-4" />} label="Company Info" active={activeTab === "company"} onClick={() => setActiveTab("company")} />
                <NavItem icon={<Briefcase className="w-4 h-4" />} label="My Listings" active={activeTab === "listings"} onClick={() => setActiveTab("listings")} />
                <NavItem icon={<Users className="w-4 h-4" />} label="Talent Pool" active={activeTab === "talent"} onClick={() => setActiveTab("talent")} />
              </>
            )}
          </div>
        </nav>
        <div className="mt-auto pt-6 border-t border-[#cfc3a0]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 mb-4 border border-[#cfc3a0]/30 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-[#2d2013] flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-[#cfc3a0]">{session?.user?.name?.[0] || 'U'}</div>
            <div className="overflow-hidden"><p className="text-sm font-black text-[#2d2013] truncate">{session?.user?.name || "User"}</p><p className="text-[10px] text-[#cb4b16] uppercase tracking-tighter font-black">{userRole}</p></div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-2 w-full p-2 text-xs text-[#7a6040] hover:text-[#cb4b16] transition-colors font-bold"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
          <header className="mb-10">
            <h1 className="text-4xl font-black tracking-tighter text-[#2d2013] capitalize">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "marketplace" && "Job Marketplace"}
              {activeTab === "applications" && "My Applications"}
              {activeTab === "personal" && "Personal Information"}
              {activeTab === "qualifications" && "My Qualifications"}
              {activeTab === "portfolio" && "Project Portfolio"}
              {activeTab === "company" && "Company Profile"}
              {activeTab === "listings" && "My Job Listings"}
              {activeTab === "talent" && "Global Talent Pool"}
            </h1>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-[#2d2013] rounded-[2.5rem] p-8 text-[#fdf6e3] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-32 h-32 rotate-12" /></div>
                    <div className="relative z-10"><h2 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Welcome back.</h2><p className="text-[#eee8d5]/80 text-sm max-w-md leading-relaxed font-light">{userRole === "STUDENT" ? "Portfolio Verified." : `Hiring mode active for ${recruiterData.companyName || "your organization"}.`}</p></div>
                  </div>
                </div>
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "marketplace" && (
              <motion.div key="marketplace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceJobs.map((job) => (
                    <div key={job.id} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#2d2013] text-white flex items-center justify-center font-black text-xl">{job.recruiterProfile?.companyName?.[0]}</div>
                        <div className="flex flex-col items-end">
                          <span className="px-3 py-1 rounded-full bg-[#cb4b16]/10 text-[#cb4b16] text-[8px] font-black uppercase tracking-widest mb-1">{job.type}</span>
                          <span className="text-[8px] font-bold text-[#7a6040] uppercase tracking-widest">{job.location}</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-black tracking-tight text-[#2d2013] mb-2">{job.title}</h4>
                      <p className="text-[10px] font-black text-[#cb4b16] uppercase tracking-widest mb-4">{job.recruiterProfile?.companyName}</p>
                      <p className="text-xs text-[#7a6040] line-clamp-3 leading-relaxed mb-8">{job.description}</p>
                      <div className="mt-auto flex items-center justify-between gap-4">
                        <button 
                          onClick={() => setViewingJob(job)} 
                          className="flex-1 bg-[#2d2013] text-[#fdf6e3] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#cb4b16] transition-all"
                        >
                          View Details
                        </button>
                        {job.hasApplied ? (
                          <div className="px-4 py-4 rounded-2xl bg-green-500/10 text-green-600 font-black uppercase tracking-widest text-[8px] border border-green-500/20">Applied ✓</div>
                        ) : (
                          <button 
                            onClick={() => handleApply(job.id)} 
                            className="p-4 rounded-2xl bg-white border border-[#cfc3a0] text-[#7a6040] hover:bg-[#2d2013] hover:text-[#fdf6e3] transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "applications" && (
              <motion.div key="applications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {myApplications?.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 border border-[#cfc3a0] rounded-[2.5rem]">
                    <p className="font-bold text-[#7a6040]">You haven't applied to any jobs yet.</p>
                  </div>
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
                        <p className="text-[10px] text-[#7a6040] mt-2 font-bold">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {userRole === "RECRUITER" && activeTab === "talent" && (
              <motion.div key="talent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {talentPool?.map((student) => (
                    <div key={student.id} className="p-8 bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-[#2d2013] text-white flex items-center justify-center text-2xl font-black ring-4 ring-[#cb4b16]/10">{student.name?.[0]}</div>
                          <div>
                            <h3 className="text-xl font-black tracking-tight">{student.name}</h3>
                            <p className="text-[10px] font-black text-[#cb4b16] uppercase tracking-widest">{student.studentProfile?.college || "Global Talent"}</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#7a6040] leading-relaxed line-clamp-3 mb-6 font-medium italic">"{student.studentProfile?.bio || "A verified SkillBridge professional ready for new opportunities."}"</p>
                      </div>
                      <button 
                        onClick={() => setViewingProfile({ user: student })}
                        className="w-full py-4 rounded-2xl bg-[#2d2013] text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#cb4b16] transition-all shadow-lg"
                      >
                        View Full Portfolio
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RECRUITER LISTINGS TAB */}
            {userRole === "RECRUITER" && activeTab === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs?.map((job) => (
                    <div key={job.id} className="p-6 bg-white/60 border border-[#cfc3a0] rounded-3xl shadow-sm group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#2d2013]">{job.title}</h4>
                        <button onClick={() => handleDeleteJob(job.id)} className="p-1 text-[#7a6040] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[8px] font-black bg-[#cb4b16] text-white px-2 py-1 rounded-full uppercase">{job.jobType}</span>
                        <span className="text-[10px] text-[#7a6040] font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      </div>
                      <p className="text-[10px] text-[#7a6040] line-clamp-2">{job.description}</p>
                      <button onClick={() => fetchApplicants(job.id)} className="mt-4 w-full py-2 bg-[#2d2013] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#cb4b16] transition-all">View Applicants</button>
                    </div>
                  ))}
                </div>

                {selectedJob && (
                  <div className="fixed inset-0 bg-[#2d2013]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#fdf6e3] w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl relative">
                      <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 p-2 text-[#7a6040] hover:text-[#cb4b16]"><Plus className="w-6 h-6 rotate-45" /></button>
                      <h3 className="text-2xl font-black mb-6">Applicants</h3>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {applicants?.length === 0 ? (
                          <p className="text-sm font-bold text-[#7a6040] text-center py-10">No applications yet.</p>
                        ) : (
                          applicants?.map((app) => (
                            <div key={app.id} className="p-4 bg-white/60 border border-[#cfc3a0] rounded-2xl flex items-center justify-between">
                              <div>
                                <p className="font-bold text-[#2d2013]">{app.user.name}</p>
                                <p className="text-[10px] text-[#cb4b16] font-black uppercase tracking-tighter">{app.status}</p>
                              </div>
                              <div className="flex gap-2 items-center">
                                {app.status === "PENDING" && (
                                  <>
                                    <button onClick={() => updateApplicationStatus(app.id, "SHORTLISTED")} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white transition-all text-[8px] font-black uppercase">Shortlist</button>
                                    <button onClick={() => updateApplicationStatus(app.id, "REJECTED")} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all text-[8px] font-black uppercase">Reject</button>
                                  </>
                                )}
                                <button onClick={() => setViewingProfile(app)} className="p-2 rounded-lg bg-[#cb4b16]/10 text-[#cb4b16] hover:bg-[#cb4b16] hover:text-white transition-all"><UserIcon className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* JOB INTELLIGENCE MODAL (STUDENT) */}
                {viewingJob && (
                  <div className="fixed inset-0 bg-[#2d2013]/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#fdf6e3] w-full max-w-3xl rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]">
                      <button onClick={() => setViewingJob(null)} className="absolute top-6 right-6 p-2 text-[#7a6040] hover:text-[#cb4b16] z-[210] bg-white/80 rounded-full shadow-sm"><Plus className="w-6 h-6 rotate-45" /></button>
                      
                      <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                        <div className="flex items-center gap-6 mb-12">
                          <div className="w-20 h-20 rounded-3xl bg-[#2d2013] text-white flex items-center justify-center text-3xl font-black shadow-xl">{viewingJob.recruiterProfile?.companyName?.[0] || "S"}</div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#cb4b16] mb-1">{viewingJob.recruiterProfile?.companyName || "Verified Partner"}</p>
                            <h2 className="text-4xl font-black tracking-tighter leading-none">{viewingJob.title || "Job Opportunity"}</h2>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-12">
                          <div className="p-6 bg-white rounded-3xl border border-[#cfc3a0]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-2">Role Type</p>
                            <p className="font-bold text-[#2d2013]">{viewingJob.type || viewingJob.jobType || "Full-time"}</p>
                          </div>
                          <div className="p-6 bg-white rounded-3xl border border-[#cfc3a0]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-2">Hiring Location</p>
                            <p className="font-bold text-[#2d2013]">{viewingJob.location || "Remote"}</p>
                          </div>
                        </div>

                        <section className="mb-12">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-6 flex items-center gap-2"><Sparkles className="w-3 h-3 text-[#cb4b16]" /> Mission & Description</h4>
                          <p className="text-lg text-[#2d2013] leading-relaxed font-medium whitespace-pre-wrap">
                            {viewingJob.description || "No description provided for this role."}
                          </p>
                        </section>

                        <section className="p-8 bg-[#2d2013] rounded-[2.5rem] text-[#fdf6e3]">
                          <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-5 h-5 text-[#cb4b16]" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified SkillBridge Listing</h4>
                          </div>
                          <p className="text-xs leading-relaxed opacity-80">
                            This listing has been verified by the SkillBridge integrity team. By applying, your verified profile and evidence portfolio will be shared directly with the {viewingJob.recruiterProfile?.companyName || "hiring team"}.
                          </p>
                        </section>
                      </div>

                      <div className="p-10 bg-white border-t border-[#cfc3a0] flex items-center justify-between gap-8">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Ready to deploy?</p>
                           <p className="text-xs font-bold text-[#2d2013]">Confirm your application below.</p>
                        </div>
                        {viewingJob.hasApplied || (marketplaceJobs.find(j => j.id === viewingJob.id)?.hasApplied) ? (
                          <div className="px-10 py-5 rounded-2xl bg-green-500/10 text-green-600 font-black uppercase tracking-widest text-xs border border-green-500/20">Application Sent ✓</div>
                        ) : (
                          <button 
                            onClick={() => { handleApply(viewingJob.id); setViewingJob(null); }} 
                            className="bg-[#cb4b16] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all"
                          >
                            Confirm Application
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}

                {viewingProfile && (
                  <div className="fixed inset-0 bg-[#2d2013]/70 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#fdf6e3] w-full max-w-5xl rounded-[3rem] shadow-2xl relative flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                      <button onClick={() => setViewingProfile(null)} className="absolute top-6 right-6 p-2 text-[#7a6040] hover:text-[#cb4b16] z-[160] bg-white/80 rounded-full shadow-sm"><Plus className="w-6 h-6 rotate-45" /></button>
                      
                      {/* LEFT: DATA DOSSIER */}
                      <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar space-y-10">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-full bg-[#2d2013] flex items-center justify-center text-white text-3xl font-black ring-4 ring-[#cb4b16]/20">{viewingProfile.user?.name?.[0]}</div>
                          <div>
                            <h2 className="text-3xl font-black tracking-tighter">{viewingProfile.user?.name}</h2>
                            <p className="text-[#cb4b16] font-bold uppercase tracking-widest text-[10px]">{viewingProfile.user?.studentProfile?.college || "SkillBridge Verified"}</p>
                          </div>
                        </div>

                        <section>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-4 flex items-center gap-2"><UserIcon className="w-3 h-3" /> Background</h4>
                          <p className="text-sm text-[#2d2013] leading-relaxed mb-4">{viewingProfile.user?.studentProfile?.bio || "A verified professional ready for new opportunities."}</p>
                          <div className="flex flex-wrap gap-4">
                            <span className="px-4 py-2 bg-white rounded-xl border border-[#cfc3a0] text-[10px] font-bold text-[#7a6040] flex items-center gap-2"><MapPin className="w-3 h-3" /> {viewingProfile.user?.studentProfile?.location || "Remote"}</span>
                            <span className="px-4 py-2 bg-white rounded-xl border border-[#cfc3a0] text-[10px] font-bold text-[#7a6040] flex items-center gap-2"><GraduationCap className="w-3 h-3" /> {viewingProfile.user?.studentProfile?.college}</span>
                          </div>
                        </section>

                        <section>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7a6040] mb-4 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Evidence Portfolio</h4>
                          <div className="grid grid-cols-1 gap-4">
                            {(!viewingProfile.user?.studentProfile?.projects || viewingProfile.user?.studentProfile?.projects?.length === 0) ? (
                              <p className="text-xs italic text-[#7a6040]">No projects added yet.</p>
                            ) : (
                              viewingProfile.user?.studentProfile?.projects?.map((p: any) => (
                                <div key={p.id} className="p-6 bg-[#2d2013] text-[#fdf6e3] rounded-3xl shadow-sm">
                                  <h5 className="font-black mb-2">{p.title}</h5>
                                  <p className="text-[10px] opacity-80 leading-relaxed mb-4">{p.description}</p>
                                  <div className="flex gap-4">
                                    {p.githubUrl && <a href={p.githubUrl} target="_blank" className="text-[10px] font-black underline hover:text-[#cb4b16]">GitHub</a>}
                                    {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-[10px] font-black underline hover:text-[#cb4b16]">Live Demo</a>}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </section>

                        {viewingProfile.user?.studentProfile?.resumeUrl && (
                          <section>
                            <a 
                              href={viewingProfile.user.studentProfile.resumeUrl} 
                              download={`${viewingProfile.user.name}_Resume.pdf`}
                              className="inline-flex items-center gap-2 bg-[#2d2013] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#cb4b16] transition-all"
                            >
                              <FileText className="w-4 h-4" /> Download Official Resume
                            </a>
                          </section>
                        )}
                      </div>

                      {/* RIGHT: AI INTELLIGENCE CARD */}
                      <div className="w-full md:w-80 bg-[#eee8d5]/60 border-l border-[#cfc3a0] p-8 flex flex-col gap-8 overflow-y-auto">
                        <div className="text-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#cb4b16] mb-1">AI Intelligence Profile</p>
                          <h3 className="text-lg font-black text-[#2d2013]">Insights Dashboard</h3>
                        </div>

                        <div className="p-6 bg-white rounded-[2rem] shadow-inner text-center space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Skill Radar</p>
                          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                             <svg className="w-full h-full transform -rotate-90">
                               <circle cx="56" cy="56" r="50" stroke="#fdf6e3" strokeWidth="8" fill="transparent" />
                               <circle cx="56" cy="56" r="50" stroke="#cb4b16" strokeWidth="8" fill="transparent" strokeDasharray="314" strokeDashoffset={314 - (314 * ((viewingProfile.user?.studentProfile?.projects?.length || 0) > 1 ? 0.88 : 0.62))} strokeLinecap="round" className="transition-all duration-1000" />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-xl font-black">{(viewingProfile.user?.studentProfile?.projects?.length || 0) > 1 ? "88%" : "62%"}</span>
                             </div>
                          </div>
                        </div>

                        <div className="p-6 bg-[#2d2013] text-[#fdf6e3] rounded-[2rem] shadow-xl">
                          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2"><Sparkles className="w-3 h-3 text-[#cb4b16]" /> AI Summary</h4>
                          <p className="text-[11px] leading-relaxed font-medium">
                            { (viewingProfile.user?.studentProfile?.projects?.length || 0) > 0 
                              ? "Evidence suggests strong technical execution with verified project output."
                              : "Pending project evidence for a more accurate technical evaluation."
                            }
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-[#cfc3a0] rounded-[2rem] mt-auto">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#7a6040] mb-3">Roadmap Completion</p>
                          <div className="w-full bg-[#fdf6e3] h-1.5 rounded-full overflow-hidden">
                             <div className="bg-[#cb4b16] h-full w-[65%] rounded-full" />
                          </div>
                        </div>

                        {userRole === "RECRUITER" && viewingProfile?.status === "PENDING" && (
                          <div className="flex flex-col gap-3">
                            <button onClick={() => { updateApplicationStatus(viewingProfile.id, "SHORTLISTED"); setViewingProfile(null); }} className="w-full py-5 rounded-2xl bg-[#cb4b16] text-white font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">Quick Hire</button>
                            <button onClick={() => { updateApplicationStatus(viewingProfile.id, "REJECTED"); setViewingProfile(null); }} className="w-full py-5 rounded-2xl bg-white text-[#2d2013] border border-[#cfc3a0] font-black uppercase tracking-widest text-xs hover:bg-[#2d2013] hover:text-white transition-all">Pass</button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
                <div className="max-w-2xl bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                  <h3 className="text-xl font-black tracking-tight mb-8">Post New Job</h3>
                  <div className="space-y-4">
                    <input type="text" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Job Title" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                    <div className="grid grid-cols-2 gap-4">
                      <select value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold appearance-none"><option>Full-time</option><option>Internship</option></select>
                      <input type="text" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Location" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                    </div>
                    <textarea rows={4} value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Job Description..." className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold resize-none" />
                    <button onClick={handlePostJob} disabled={saveLoading} className="w-full bg-[#cb4b16] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Post Listing</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs remain fully functional ... */}
            {userRole === "RECRUITER" && activeTab === "company" && (
              <motion.div key="company" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Company Name</label><input type="text" value={recruiterData.companyName} onChange={(e) => setRecruiterData({...recruiterData, companyName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Bio</label><textarea rows={4} value={recruiterData.publicBio} onChange={(e) => setRecruiterData({...recruiterData, publicBio: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold resize-none" /></div>
                  </div>
                  <button onClick={() => handleUpdate(recruiterData)} disabled={saveLoading} className="bg-[#2d2013] text-[#fdf6e3] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-xl">Save Info</button>
                </div>
              </motion.div>
            )}
            
            {userRole === "STUDENT" && activeTab === "personal" && (
              <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Public Username</label>
                      <input type="text" value={personalData.username} onChange={(e) => setPersonalData({...personalData, username: e.target.value})} placeholder="yourname" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                      {personalData.username && <p className="text-[10px] font-bold text-[#cb4b16] mt-1 italic">Your Link: skill-bridge-khaki-gamma.vercel.app/u/{personalData.username.toLowerCase().replace(/[^a-z0-9]/g, '')}</p>}
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Birth Date</label><input type="date" value={personalData.dob} onChange={(e) => setPersonalData({...personalData, dob: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Location</label><input type="text" value={personalData.location} onChange={(e) => setPersonalData({...personalData, location: e.target.value})} placeholder="City, Country" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Short Bio</label><textarea rows={3} value={personalData.bio} onChange={(e) => setPersonalData({...personalData, bio: e.target.value})} placeholder="Tell the world what you do..." className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold resize-none" /></div>
                  </div>
                  <button onClick={() => handleUpdate(personalData)} disabled={saveLoading} className="bg-[#2d2013] text-[#fdf6e3] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-xl">Save Personal Info</button>
                </div>
              </motion.div>
            )}

            {userRole === "STUDENT" && activeTab === "qualifications" && (
              <motion.div key="qualifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Current College/University</label><input type="text" value={qualData.college} onChange={(e) => setQualData({...qualData, college: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Previous School</label><input type="text" value={qualData.school} onChange={(e) => setQualData({...qualData, school: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" /></div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">Professional Resume (PDF)</label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer group">
                          <div className="w-full px-6 py-8 rounded-3xl bg-[#fdf6e3] border-2 border-dashed border-[#cfc3a0] group-hover:border-[#cb4b16] transition-all flex flex-col items-center justify-center gap-2">
                            <Upload className="w-6 h-6 text-[#7a6040] group-hover:text-[#cb4b16] group-hover:scale-110 transition-all" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#7a6040]">{qualData.resumeUrl ? "Change Resume" : "Browse Files"}</span>
                            {qualData.resumeUrl && <span className="text-[8px] font-bold text-green-600 uppercase">File Attached ✓</span>}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 1024 * 1024 * 2) { // 2MB Limit for Base64
                                  alert("File is too large! Please use a PDF under 2MB.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setQualData({ ...qualData, resumeUrl: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleUpdate(qualData)} disabled={saveLoading} className="bg-[#2d2013] text-[#fdf6e3] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#cb4b16] transition-all shadow-xl">Save Qualifications</button>
                </div>
              </motion.div>
            )}
            
            {userRole === "STUDENT" && activeTab === "portfolio" && (
              <motion.div key="portfolio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData?.studentProfile?.projects?.map((p: any) => (
                    <div key={p.id} className="p-6 bg-white/60 border border-[#cfc3a0] rounded-3xl shadow-sm group">
                      <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-[#2d2013]">{p.title}</h4><button onClick={() => handleDeleteProject(p.id)} className="p-1 text-[#7a6040] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button></div>
                      <p className="text-[10px] text-[#7a6040] line-clamp-1">{p.description}</p>
                    </div>
                  ))}
                </div>
                <div className="max-w-2xl bg-white/60 border border-[#cfc3a0] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                  <h3 className="text-xl font-black tracking-tight mb-8">Add New Project</h3>
                  <div className="space-y-4">
                    <input type="text" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="Project Title" className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold" />
                    <textarea rows={3} value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="Project Description..." className="w-full px-6 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none font-bold resize-none" />
                    <button onClick={() => handleUpdate({ projects: [newProject] })} disabled={saveLoading} className="w-full bg-[#cb4b16] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Add Project</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-[#cb4b16] text-white shadow-lg' : 'text-[#7a6040] hover:bg-[#e5dcc5]'}`}>
      {icon} <span className="flex-1 text-left">{label}</span>
    </button>
  );
}
