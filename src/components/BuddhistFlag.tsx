"use client";

import { motion } from "framer-motion";

export default function BuddhistFlag() {
  return (
    <motion.div
      className="relative w-8 h-6 rounded overflow-hidden shadow-sm border border-black/5"
      style={{
        display: "flex",
        background: "#fff",
      }}
      animate={{
        y: [0, -1, 0, 1, 0],
        rotateZ: [0, 1, 0, -1, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* 5 Vertical Stripes */}
      <div className="flex-1 bg-[#0033A0]" /> {/* Blue */}
      <div className="flex-1 bg-[#FFD100]" /> {/* Yellow */}
      <div className="flex-1 bg-[#CE1126]" /> {/* Red */}
      <div className="flex-1 bg-[#FFFFFF]" /> {/* White */}
      <div className="flex-1 bg-[#E77B00]" /> {/* Orange */}
      
      {/* 6th Vertical Stripe containing 5 horizontal slices */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-[#0033A0]" />
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#E77B00]" />
      </div>

      {/* Glossy Wave Overlay for 3D effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}
