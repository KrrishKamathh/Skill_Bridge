"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LusionLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Slower increment for a 4-5 second cinematic loader
      currentProgress += Math.floor(Math.random() * 3) + 1;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onComplete, 800);
        }, 600); // brief pause at 100%
      }
      setProgress(currentProgress);
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ backgroundColor: '#fdf6e3' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="text-[#cfc3a0] text-3xl md:text-6xl font-bold tracking-[0.2em] uppercase"
            >
              SkillBridge
            </motion.h1>
          </div>
          
          <div className="absolute bottom-10 right-10 overflow-hidden">
            <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="text-[#cb4b16] font-mono text-5xl md:text-8xl font-bold tracking-tighter"
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
