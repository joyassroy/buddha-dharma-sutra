"use client";

import { motion, useScroll } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-20 left-0 right-0 h-1.5 bg-primary/20 z-40 transform origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
