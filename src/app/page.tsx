"use client";

import { useState } from "react";
import { MoveRight, BrainCircuit, ActivitySquare, Users, Terminal, Sparkles, MessageCircle, Globe, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CustomCursor } from "./components/ui/CustomCursor";
import { MagneticWrapper } from "./components/ui/MagneticWrapper";
import { SpotlightCard } from "./components/ui/SpotlightCard";
import { TiltCard } from "./components/ui/TiltCard";
import { DashboardMockupSVG } from "./components/ui/DashboardMockupSVG";
import { LusionLoader } from "./components/ui/LusionLoader";
import { AnimatedGrain } from "./components/ui/AnimatedGrain";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main style={{ backgroundColor: '#fdf6e3' }} className="min-h-screen text-[#2d2013] relative overflow-x-hidden pt-24 font-sans selection:bg-[#cb4b16]/20">
      
      <CustomCursor />
      <AnimatedGrain />
      <LusionLoader onComplete={() => setIsLoading(false)} />

      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Navigation */}
        <nav className="absolute top-0 w-full p-6 md:p-8 flex justify-between items-center z-40">
          <MagneticWrapper>
            <div className="font-black text-2xl tracking-tighter text-[#2d2013] flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-[#2d2013] flex items-center justify-center group-hover:bg-[#cb4b16] transition-colors shadow-lg">
                <div className="w-2.5 h-2.5 bg-[#fdf6e3] rounded-full" />
              </div>
              <span className="hidden sm:block">SkillBridge</span>
            </div>
          </MagneticWrapper>
          
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-[#7a6040]">
            <span className="hover:text-[#cb4b16] transition-colors cursor-pointer">Curriculum</span>
            <span className="hover:text-[#cb4b16] transition-colors cursor-pointer">Velocity</span>
            <span className="hover:text-[#cb4b16] transition-colors cursor-pointer">Network</span>
            <span className="hover:text-[#cb4b16] transition-colors cursor-pointer">Pricing</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-[#7a6040] hover:text-[#2d2013] transition-colors">
              Sign In
            </Link>
            <MagneticWrapper>
              <Link href="/signup">
                <button className="px-6 py-3 bg-[#2d2013] text-[#fdf6e3] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#cb4b16] transition-colors shadow-xl active:scale-95">
                  Join Free
                </button>
              </Link>
            </MagneticWrapper>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-center mb-40 max-w-5xl mx-auto px-6 relative z-10 pt-28"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#cfc3a0] bg-[#eee8d5]/40 text-[#cb4b16] text-[10px] font-black uppercase tracking-widest mb-8">
            <Sparkles className="w-3 h-3" />
            The Career Bridge for the Next Generation
          </div>
          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter mb-10 leading-[0.85] text-[#2d2013]">
            Bridge <span className="text-[#cb4b16]">The</span>.<br />Gap.
          </h1>
          <p className="text-lg md:text-2xl text-[#7a6040] mb-14 max-w-3xl mx-auto font-medium leading-tight">
            The platform where students build "Proof of Skill" through real projects and recruiters find vetted talent. No more generic resumes — just data-backed potential.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <MagneticWrapper>
              <Link href="/signup">
                <button className="px-10 py-5 bg-[#2d2013] text-[#fdf6e3] font-black text-sm uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-[#cb4b16] transition-all group shadow-2xl active:scale-95">
                  Begin Your Journey
                  <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </MagneticWrapper>
            <MagneticWrapper>
              <button className="px-10 py-5 bg-white/20 border border-[#cfc3a0] text-[#7a6040] font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white/40 hover:text-[#2d2013] transition-all shadow-sm">
                View Curriculum
              </button>
            </MagneticWrapper>
          </div>
        </motion.section>

        {/* Bento Grid */}
        <section className="px-6 max-w-7xl mx-auto relative z-10 pointer-events-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#2d2013] mb-4">Vetted Talent. Verified Skills.</h2>
            <p className="text-[#7a6040] font-bold text-sm uppercase tracking-widest">Bridging the distance between education and employment.</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-8"
          >
            <SpotlightCard className="lg:col-span-2">
              <BrainCircuit className="w-12 h-12 text-[#cb4b16] mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-4 text-[#2d2013]">Proof of Skill</h3>
              <p className="text-[#7a6040] font-medium leading-relaxed">Students showcase their abilities through verifiable projects. Recruiters see exactly what a candidate can build, backed by real evidence and skill assessments.</p>
            </SpotlightCard>
            
            <SpotlightCard className="lg:col-span-2">
              <Terminal className="w-12 h-12 text-[#2aa198] mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-4 text-[#2d2013]">Precision Matching</h3>
              <p className="text-[#7a6040] font-medium leading-relaxed">Our AI engine analyzes the "Skill-Gap" between a student's profile and job requirements, providing a roadmap to bridge that gap and get hired.</p>
            </SpotlightCard>
            
            <SpotlightCard className="lg:col-span-2">
              <ActivitySquare className="w-12 h-12 text-[#b58900] mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-4 text-[#2d2013]">Recruiter Portal</h3>
              <p className="text-[#7a6040] font-medium leading-relaxed">A powerful dashboard for recruiters to post jobs, track applicants, and filter by "Actual Experience" rather than just keywords on a resume.</p>
            </SpotlightCard>
            
            <SpotlightCard className="lg:col-span-2">
              <Users className="w-12 h-12 text-[#268bd2] mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-4 text-[#2d2013]">Feedback Loop</h3>
              <p className="text-[#7a6040] font-medium leading-relaxed">When a student is rejected, they don't just get a "no". They get a data-backed explanation of the skill gaps they need to close for the next attempt.</p>
            </SpotlightCard>
          </motion.div>
        </section>

        {/* 3D Dashboard Showcase */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98, y: 60 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="py-40 px-6 max-w-6xl mx-auto flex flex-col items-center pointer-events-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#2d2013] mb-4">Command Your Career</h2>
            <p className="text-[#7a6040] font-bold text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">One unified interface for skills, projects, and job opportunities.</p>
          </div>
          <TiltCard className="h-[650px] w-full flex items-center justify-center relative overflow-hidden group rounded-[3rem] border border-[#cfc3a0] bg-white/60 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cb4b16]/5 to-[#2aa198]/5 opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
            <div style={{ transform: "translateZ(100px)" }} className="text-center z-20 pointer-events-none w-full flex justify-center drop-shadow-2xl px-12">
              <DashboardMockupSVG />
            </div>
          </TiltCard>
        </motion.section>

        {/* Footer */}
        <footer className="bg-[#eee8d5] border-t border-[#cfc3a0] pt-24 pb-12 px-6 relative z-10 pointer-events-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-1">
              <div className="font-black text-2xl tracking-tighter text-[#2d2013] mb-6 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#2d2013] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#fdf6e3] rounded-full" />
                </div>
                SkillBridge
              </div>
              <p className="text-sm text-[#7a6040] leading-relaxed font-medium">
                Designing the future of developer education. Based in Berlin, shipping globally.
              </p>
              <div className="flex gap-4 mt-8">
                <MagneticWrapper><Globe className="w-5 h-5 text-[#b5a080] hover:text-[#cb4b16] transition-colors cursor-pointer" /></MagneticWrapper>
                <MagneticWrapper><MessageCircle className="w-5 h-5 text-[#b5a080] hover:text-[#cb4b16] transition-colors cursor-pointer" /></MagneticWrapper>
                <MagneticWrapper><Share2 className="w-5 h-5 text-[#b5a080] hover:text-[#cb4b16] transition-colors cursor-pointer" /></MagneticWrapper>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2d2013] mb-8">Platform</h4>
              <ul className="space-y-4 text-xs font-bold text-[#7a6040]">
                <li><Link href="/" className="hover:text-[#cb4b16] transition-colors">Catalog</Link></li>
                <li><Link href="/" className="hover:text-[#cb4b16] transition-colors">Mentorship</Link></li>
                <li><Link href="/" className="hover:text-[#cb4b16] transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2d2013] mb-8">Company</h4>
              <ul className="space-y-4 text-xs font-bold text-[#7a6040]">
                <li><Link href="/" className="hover:text-[#cb4b16] transition-colors">About Us</Link></li>
                <li><Link href="/" className="hover:text-[#cb4b16] transition-colors">Careers</Link></li>
                <li><Link href="/" className="hover:text-[#cb4b16] transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2d2013] mb-8">Join the Pulse</h4>
              <div className="flex bg-[#fdf6e3] rounded-xl border border-[#cfc3a0] p-1 shadow-sm">
                <input type="email" placeholder="Email Address" className="bg-transparent border-none focus:ring-0 text-xs flex-1 px-4 py-2 font-bold" />
                <button className="bg-[#2d2013] text-[#fdf6e3] rounded-lg px-4 py-2 text-[10px] font-black hover:bg-[#cb4b16] transition-colors">SUBSCRIBE</button>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-[#cfc3a0] pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b5a080]">© 2024 SkillBridge Labs Berlin Gmbh. All Rights Reserved.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[#b5a080]">
              <span className="cursor-pointer hover:text-[#2d2013]">Privacy Policy</span>
              <span className="cursor-pointer hover:text-[#2d2013]">Terms of Service</span>
            </div>
          </div>
        </footer>
        
      </div>
    </main>
  );
}
