"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to smoothly map cursor rendering
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-50 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Pitch Black Flashlight Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 mix-blend-screen"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.4), transparent 60%)`
        }}
      />

      {/* Navbar */}
      <header className="fixed top-0 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl z-40 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Title */}
          <Link 
            href="/" 
            className="text-2xl font-bold tracking-tight text-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]"
          >
            SkillBridge
          </Link>

          {/* Login Button */}
          <nav>
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 font-medium text-white transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20 relative z-20">
        
        {/* Perpetually Animated Title Container */}
        <div className="opacity-0 animate-fade-in-up animation-delay-100 relative z-10 mb-8 py-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight cursor-default animate-float-title">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 animate-gradient-x drop-shadow-[0_0_30px_rgba(96,165,250,0.6)]">SkillBridge</span>
          </h1>
        </div>
        
        <p className="max-w-2xl text-xl md:text-2xl text-slate-300 italic font-light leading-relaxed relative z-10 opacity-0 animate-fade-in-up animation-delay-200">
          "Bridging the gap between learning and doing. Your journey to mastery starts right here."
        </p>
        
        <div className="mt-14 relative z-10 opacity-0 animate-fade-in-up animation-delay-300">
          <Link href="/signup">
            <button className="px-8 py-4 rounded-full border border-blue-500/50 bg-blue-600/90 backdrop-blur-sm text-lg font-medium text-white transition-all duration-500 hover:bg-blue-500 hover:scale-105 shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.8)]">
              Explore Courses
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
