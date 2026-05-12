"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Globe, 
  ExternalLink, 
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  FileText
} from "lucide-react";

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/u/${username}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    if (username) fetchUser();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-[#fdf6e3] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-[#cb4b16] border-t-transparent rounded-full" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#fdf6e3] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-[#2d2013] mb-4 tracking-tighter">404</h1>
      <p className="text-xl font-bold text-[#7a6040]">Profile Not Found</p>
    </div>
  );

  const profile = user.studentProfile;

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#2d2013] font-sans selection:bg-[#cb4b16]/20 pb-20">
      
      {/* Editorial Header */}
      <div className="bg-[#2d2013] text-[#fdf6e3] py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Sparkles className="w-64 h-64" /></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 rounded-full bg-[#fdf6e3] text-[#2d2013] flex items-center justify-center text-6xl font-black shadow-2xl ring-8 ring-[#cb4b16]/20">
              {user.name?.[0]}
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="bg-[#cb4b16] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 tracking-widest"><ShieldCheck className="w-3 h-3" /> SkillBridge Verified</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold opacity-80 mb-6">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile?.location || "Global Candidate"}</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile?.college}</span>
              </div>
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" className="inline-flex items-center gap-2 bg-[#cb4b16] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#fdf6e3] hover:text-[#2d2013] transition-all shadow-xl">
                  <FileText className="w-4 h-4" /> View Full Resume
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Bio Side Panel */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-10 pt-20">
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-4">The Persona</h4>
              <p className="text-sm leading-relaxed text-[#7a6040] font-medium">{profile?.bio || "No bio provided yet."}</p>
            </section>
            
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cb4b16] mb-4">Background</h4>
              <div className="p-6 bg-white border border-[#cfc3a0] rounded-3xl shadow-sm">
                <p className="text-xs font-black mb-1">{profile?.college}</p>
                <p className="text-[10px] text-[#7a6040] font-bold">{profile?.school}</p>
              </div>
            </section>
          </motion.div>

          {/* Evidence Portfolio */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-2 pt-20 space-y-12">
            <h2 className="text-4xl font-black tracking-tighter">Evidence Portfolio</h2>
            
            <div className="space-y-6">
              {profile?.projects?.length === 0 ? (
                <p className="text-[#7a6040] font-bold">No projects showcased yet.</p>
              ) : (
                profile.projects.map((p: any) => (
                  <div key={p.id} className="group p-8 bg-white border border-[#cfc3a0] rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black tracking-tight">{p.title}</h3>
                      <div className="flex gap-2">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" className="p-2 rounded-xl bg-[#2d2013] text-[#fdf6e3] hover:bg-[#cb4b16] transition-colors"><Globe className="w-4 h-4" /></a>}
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" className="p-2 rounded-xl bg-[#cb4b16] text-white hover:bg-[#2d2013] transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    <p className="text-sm text-[#7a6040] leading-relaxed mb-6">{p.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#cb4b16]">Verified Project Evidence</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 text-center py-10 opacity-20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-4 h-4 rounded bg-[#cb4b16]" />
          <span className="font-black text-xs tracking-tighter text-[#2d2013]">SkillBridge verified Profile</span>
        </div>
      </footer>

    </div>
  );
}
