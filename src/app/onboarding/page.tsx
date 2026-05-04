"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Link as LinkIcon, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  CheckCircle2,
  Building,
  IdCard,
  FileText
} from "lucide-react";
import { useSession } from "next-auth/react";

type OnboardingStep = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  
  const userRole = (session?.user as any)?.role || "STUDENT";

  // Form State
  const [formData, setFormData] = useState({
    // Student fields
    dob: "",
    location: "",
    college: "",
    degree: "",
    achievements: "",
    projectName: "",
    projectUrl: "",
    // Recruiter fields
    privatePhone: "",
    idVerification: "",
    companyName: "",
    designation: "",
    publicBio: ""
  });

  const handleNext = () => setStep((s) => (s + 1) as OnboardingStep);
  
  const finishOnboarding = async () => {
    setLoading(true);
    try {
      const payload = userRole === "STUDENT" ? {
        dob: formData.dob,
        college: formData.college,
        school: formData.degree,
        achievements: formData.achievements,
        projects: [{ title: formData.projectName, githubUrl: formData.projectUrl }]
      } : {
        privatePhone: formData.privatePhone,
        idVerification: formData.idVerification,
        companyName: formData.companyName,
        designation: formData.designation,
        publicBio: formData.publicBio
      };

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Failed to save profile. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fdf6e3' }} className="min-h-screen text-[#2d2013] selection:bg-[#cb4b16]/20 py-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#cb4b16]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2aa198]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black tracking-tighter">Setting up your {userRole.toLowerCase()} profile</h1>
            <span className="text-sm font-bold text-[#7a6040] uppercase tracking-widest">Step {step} of {userRole === "STUDENT" ? 4 : 3}</span>
          </div>
          <div className="h-1.5 w-full bg-[#eee8d5] rounded-full overflow-hidden border border-[#cfc3a0]">
            <motion.div 
              className="h-full bg-[#cb4b16]" 
              initial={{ width: 0 }}
              animate={{ width: `${(step / (userRole === "STUDENT" ? 4 : 3)) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${userRole}-step-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/90 backdrop-blur-xl border border-[#cfc3a0] rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {/* STUDENT PATH */}
            {userRole === "STUDENT" && (
              <>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <User className="w-8 h-8 text-[#cb4b16]" /> Personal Details
                      </h2>
                      <p className="text-[#7a6040]">Hi {session?.user?.name || 'there'}, let's start with your basics.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#7a6040] ml-1">Date of Birth</label>
                        <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#7a6040] ml-1">Current Location</label>
                        <input type="text" placeholder="e.g. Mumbai, India" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                      </div>
                    </div>
                    <button onClick={handleNext} className="w-full py-5 bg-[#2d2013] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#cb4b16] transition-colors shadow-lg">
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <GraduationCap className="w-8 h-8 text-[#cb4b16]" /> Education
                      </h2>
                      <p className="text-[#7a6040]">Where did you build your academic foundation?</p>
                    </div>
                    <div className="space-y-4">
                      <input type="text" placeholder="College / University Name" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                      <input type="text" placeholder="Degree (e.g. B.Tech CS)" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                    </div>
                    <button onClick={handleNext} className="w-full py-5 bg-[#2d2013] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#cb4b16] transition-colors shadow-lg">
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <Trophy className="w-8 h-8 text-[#cb4b16]" /> Achievements
                      </h2>
                      <p className="text-[#7a6040]">Tell us about your biggest wins.</p>
                    </div>
                    <textarea rows={4} placeholder="e.g. Winner of Smart India Hackathon..." value={formData.achievements} onChange={(e) => setFormData({...formData, achievements: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium resize-none" />
                    <button onClick={handleNext} className="w-full py-5 bg-[#2d2013] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#cb4b16] transition-colors shadow-lg">
                      Almost There <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <LinkIcon className="w-8 h-8 text-[#cb4b16]" /> Project Showcase
                      </h2>
                      <p className="text-[#7a6040]">The "Evidence" recruiters need to see.</p>
                    </div>
                    <div className="space-y-4">
                      <input type="text" placeholder="Project Name" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                      <input type="text" placeholder="GitHub / Demo URL" value={formData.projectUrl} onChange={(e) => setFormData({...formData, projectUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                    </div>
                    <button onClick={finishOnboarding} disabled={loading} className="w-full py-5 bg-[#2aa198] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#2d2013] transition-colors shadow-lg">
                      {loading ? "Loading..." : "Finish Onboarding"} <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* RECRUITER PATH */}
            {userRole === "RECRUITER" && (
              <>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <ShieldCheck className="w-8 h-8 text-[#cb4b16]" /> Private Verification
                      </h2>
                      <p className="text-[#7a6040]">This data is only visible to the site owner for verification.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#7a6040] ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6040]" />
                          <input type="tel" placeholder="+91 00000 00000" value={formData.privatePhone} onChange={(e) => setFormData({...formData, privatePhone: e.target.value})} className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#7a6040] ml-1">Government ID / LinkedIn Profile</label>
                        <div className="relative">
                          <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6040]" />
                          <input type="text" placeholder="URL or ID Number" value={formData.idVerification} onChange={(e) => setFormData({...formData, idVerification: e.target.value})} className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                        </div>
                      </div>
                    </div>
                    <button onClick={handleNext} className="w-full py-5 bg-[#2d2013] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#cb4b16] transition-colors shadow-lg">
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <Building className="w-8 h-8 text-[#cb4b16]" /> Professional Details
                      </h2>
                      <p className="text-[#7a6040]">Tell us about your organization and role.</p>
                    </div>
                    <div className="space-y-4">
                      <input type="text" placeholder="Company Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                      <input type="text" placeholder="Your Designation (e.g. Senior HR Manager)" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium" />
                    </div>
                    <button onClick={handleNext} className="w-full py-5 bg-[#2d2013] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#cb4b16] transition-colors shadow-lg">
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#2d2013]">
                        <FileText className="w-8 h-8 text-[#cb4b16]" /> Public Bio
                      </h2>
                      <p className="text-[#7a6040]">This bio will be shown to students on your profile.</p>
                    </div>
                    <textarea rows={4} placeholder="Tell talent why they should join your team..." value={formData.publicBio} onChange={(e) => setFormData({...formData, publicBio: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[#fdf6e3] border border-[#cfc3a0] focus:border-[#cb4b16] outline-none transition-all font-medium resize-none" />
                    <button onClick={finishOnboarding} disabled={loading} className="w-full py-5 bg-[#2aa198] text-[#fdf6e3] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#2d2013] transition-colors shadow-lg">
                      {loading ? "Loading..." : "Finish Onboarding"} <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
