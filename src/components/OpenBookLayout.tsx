"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Library, HandHeart, Info, ArrowRight } from "lucide-react";
import QuotesSection from "./QuotesSection";

export default function OpenBookLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decor (Premium Mesh Gradient Glows) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-60">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#A7F3D0]/60 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#6EE7B7]/40 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#FDE68A]/30 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl w-full pt-10"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          
          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight tracking-tight">
                Awaken Your <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Inner Peace</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-lg mb-8 leading-relaxed font-light">
                A digital sanctuary for the profound teachings of the Buddha. Read sacred sutras, explore deep insights, and begin your journey to enlightenment.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Link href="/sutras" className="group flex items-center gap-2 bg-gradient-to-r from-primary to-[#059669] text-white px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  Start Reading
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="px-8 py-3.5 rounded-full font-medium text-foreground border border-foreground/10 hover:bg-foreground/5 transition-all">
                  Our Mission
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Premium Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1 relative w-full max-w-sm"
          >
            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white/50 backdrop-blur-sm">
              <Image 
                src="/hero-image.png" 
                alt="Glowing Bodhi Leaf" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-primary/10"
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs text-foreground/60 font-semibold uppercase tracking-wider">Collection</p>
                <p className="font-bold text-foreground font-serif">10,000+ Sutras</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* The 4 Core Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          <ModuleCard
            title="Sutras Panel"
            description="Read the sacred texts in English and Bengali."
            icon={<BookOpen size={24} />}
            href="/sutras"
            delay={0.4}
          />
          <ModuleCard
            title="Insights"
            description="Reflections and wisdom from monks."
            icon={<Info size={24} />}
            href="/blog"
            delay={0.5}
          />
          <ModuleCard
            title="E-Library"
            description="Download Tripitaka & Dhamma books."
            icon={<Library size={24} />}
            href="/library"
            delay={0.6}
          />
          <ModuleCard
            title="Support"
            description="Help us spread the Dhamma worldwide."
            icon={<HandHeart size={24} />}
            href="/donate"
            delay={0.7}
          />
        </div>

        {/* Buddha Quotes Section */}
        <QuotesSection />
      </motion.div>
    </div>
  );
}

function ModuleCard({
  title,
  description,
  icon,
  href,
  delay,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  delay: number;
}) {
  return (
    <Link href={href} className="group outline-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        className="p-6 rounded-3xl bg-white/80 backdrop-blur-lg border border-white shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col items-start gap-4 h-full relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{title}</h2>
          <p className="text-foreground/70 text-sm leading-relaxed font-light">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
