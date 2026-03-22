"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";

import MeteorReveal from "./components/MeteorReveal";

// FEATURE TOGGLE: Set to false to disable the Abyssal Meteor animation
const SHOW_METEOR_REVEAL = true;

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(!SHOW_METEOR_REVEAL);
  // Separate state to control when the actual UI elements fade in
  const [showUI, setShowUI] = useState(!SHOW_METEOR_REVEAL);
  const [isInitializing, setIsInitializing] = useState(SHOW_METEOR_REVEAL);
  
  // Real-time tracking for the meteor spotlight
  const meteorX = useMotionValue(-1000);
  const meteorY = useMotionValue(-1000);
  const meteorOpacity = useMotionValue(0);

  useEffect(() => {
    if (SHOW_METEOR_REVEAL) {
      const timer = setTimeout(() => setIsInitializing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleImpact = () => {
    setIsRevealed(true);
    // Wait for the sparks to spread before revealing UI
    setTimeout(() => setShowUI(true), 4500);
  };

  return (
    <div 
      className={`min-h-screen text-slate-50 font-sans selection:bg-blue-500/30 overflow-hidden relative cursor-default select-none transition-colors duration-[3000ms] ${isRevealed ? 'bg-[#000308]' : 'bg-black'}`}
    >
      {SHOW_METEOR_REVEAL && (
        <MeteorReveal 
          onImpact={handleImpact}
          meteorX={meteorX}
          meteorY={meteorY}
          meteorOpacity={meteorOpacity}
          isInitializing={isInitializing}
        />
      )}

      {/* THE MAIN UI CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showUI ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          // Mask only used for post-reveal flavor, not for the initial "glimpse"
          maskImage: useMotionTemplate`radial-gradient(circle ${isRevealed ? '5000px' : '220px'} at ${meteorX}px ${meteorY}px, black 0%, transparent 100%)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(circle ${isRevealed ? '5000px' : '220px'} at ${meteorX}px ${meteorY}px, black 0%, transparent 100%)`,
          transition: isRevealed ? 'mask-image 6s cubic-bezier(0.16, 1, 0.3, 1), -webkit-mask-image 6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
        }}
        className="relative z-10 w-full h-full"
      >
        {/* Navbar */}
        <header className="fixed top-0 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link 
              href="/" 
              className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
            >
              SkillBridge
            </Link>

            <nav>
              <Link href="/login">
                <motion.button 
                  whileTap={{ scale: 0.95, boxShadow: "0 0 25px rgba(56,189,248,0.6)", backgroundColor: "rgba(255,255,255,0.15)" }}
                  className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 font-medium text-white transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                >
                  Login
                </motion.button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={showUI ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 2 }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter cursor-default">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]">SkillBridge</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={showUI ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 2.5 }}
            className="max-w-3xl text-xl md:text-3xl text-slate-400 font-extralight leading-relaxed italic tracking-wide"
          >
            "Bridging the gap between learning and doing. Your journey to mastery starts right here."
          </motion.p>
        </main>

        {/* Dynamic Background Glows on Reveal */}
        {isRevealed && (
          <div className="fixed inset-0 pointer-events-none -z-10 animate-fade-in duration-[4000ms]">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[180px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[180px] animate-pulse animation-delay-[2000ms]" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
