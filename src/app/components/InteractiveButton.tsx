"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
  variant?: "primary" | "secondary" | "danger";
}

export default function InteractiveButton({ 
  children, 
  onClick, 
  className = "", 
  glowColor = "rgba(56, 189, 248, 0.6)",
  variant = "primary"
}: InteractiveButtonProps) {
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    danger: "bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/20"
  };

  const glowShadow = `0 0 25px ${glowColor}`;

  return (
    <motion.button
      whileTap={{ 
        scale: 0.95, 
        boxShadow: glowShadow,
        backgroundColor: variant === "secondary" ? "rgba(255, 255, 255, 0.15)" : undefined
      }}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
