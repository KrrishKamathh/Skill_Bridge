"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface MeteorRevealProps {
  onImpact: () => void;
  meteorX: any;
  meteorY: any;
  meteorOpacity: any;
  isInitializing: boolean;
}

export default function MeteorReveal({ 
  onImpact, 
  meteorX, 
  meteorY, 
  meteorOpacity,
  isInitializing 
}: MeteorRevealProps) {
  const [isExploded, setIsExploded] = useState(false);
  const [showClouds, setShowClouds] = useState(false);

  const handleImpactInternal = () => {
    setIsExploded(true);
    setShowClouds(true);
    onImpact();
    // Extremely slow cloud fade
    setTimeout(() => setShowClouds(false), 5000);
  };

  return (
    <>
      {/* THE ABYSSAL METEOR */}
      <AnimatePresence>
        {!isExploded && !isInitializing && (
          <motion.div
            initial={{ x: "115vw", y: "-15vh", rotate: -45, scale: 0.8 }}
            animate={{ 
              x: "0vw", 
              y: "100vh", 
              scale: 1.4,
              rotate: -45
            }}
            transition={{ 
              duration: 8, 
              ease: "linear",
            }}
            onUpdate={(latest) => {
              const xPos = (parseFloat(latest.x as string) / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
              const yPos = (parseFloat(latest.y as string) / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);
              meteorX.set(xPos);
              meteorY.set(yPos);
              meteorOpacity.set(1);
            }}
            onAnimationComplete={handleImpactInternal}
            className="fixed z-[100] w-96 h-32 pointer-events-none origin-right"
          >
            {/* THE BURNING FLAME BALL (NO TAIL) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center z-10">
              {/* Core Brightness */}
              <div className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_50px_20px_rgba(255,255,255,0.9)] z-30" />
              
              {/* Intense Inner Flame */}
              <motion.div 
                animate={{ scale: [1, 1.4, 1.1], rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                className="absolute w-12 h-12 bg-gradient-to-tr from-yellow-300 via-orange-500 to-red-600 rounded-full blur-[4px] z-20" 
              />

              {/* Outer Burning Aura */}
              <motion.div 
                animate={{ scale: [1.2, 1.6, 1.3], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 0.15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-16 h-16 bg-red-600/60 rounded-full blur-[12px] z-10" 
              />
              
              {/* Impact Glow Field */}
              <div className="absolute w-24 h-24 bg-orange-500/20 rounded-full blur-[30px] z-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE IMPACT EXPLOSION & NEBULA CLOUDS */}
      <AnimatePresence>
        {isExploded && (
          <>
            {/* Initial Blinding Flash */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 20, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="fixed bottom-0 left-0 z-[120] w-32 h-32 bg-orange-100 rounded-full blur-3xl pointer-events-none"
            />

            {/* Nebula Clouds */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showClouds ? 1 : 0 }}
              transition={{ duration: 5, ease: "easeInOut" }}
              className="fixed inset-0 z-[110] pointer-events-none bg-[#000308]"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[100vw] h-[100vh] bg-indigo-950/40 rounded-full blur-[120px]"
                  animate={{ 
                    x: [Math.random() * 100, Math.random() * -100],
                    y: [Math.random() * 100, Math.random() * -100],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  style={{ 
                    bottom: `${Math.random() * 50 - 25}%`, 
                    left: `${Math.random() * 50 - 25}%` 
                  }}
                />
              ))}
            </motion.div>

            {/* REALISTIC FIRE SPARKLES (Impact Burst) */}
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "0vw", y: "100vh", opacity: 1, scale: Math.random() * 1.5 + 0.5 }}
                animate={{ 
                  x: `${Math.random() * 200 - 40}vw`, 
                  y: `${Math.random() * -200 + 40}vh`,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 1080
                }}
                transition={{ duration: 4 + Math.random() * 4, ease: "easeOut" }}
                className={`fixed z-[115] w-2 h-2 rounded-full blur-[0.5px] pointer-events-none ${
                  i % 3 === 0 ? 'bg-orange-500' : i % 3 === 1 ? 'bg-red-600' : 'bg-yellow-400'
                }`}
                style={{ 
                  bottom: -10, 
                  left: -10,
                  boxShadow: i % 2 === 0 ? '0 0 10px #f97316' : '0 0 8px #ef4444'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
