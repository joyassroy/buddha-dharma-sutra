"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function QuotesSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-24 px-4 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 w-full"
        >
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white/60 backdrop-blur-sm">
            <Image
              src="/buddha-quote-1.png"
              alt="Serene Buddha Statue in Garden"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#043927]/60 via-transparent to-transparent opacity-80" />
          </div>
        </motion.div>

        {/* Text / Quote Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="absolute -top-12 -left-8 text-primary/10">
            <Quote size={120} fill="currentColor" aria-hidden="true" />
          </div>
          
          <div className="relative z-10 bg-white/60 dark:bg-foreground/5 backdrop-blur-xl p-10 md:p-12 rounded-[2rem] border border-white dark:border-primary/20 shadow-xl shadow-primary/5">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6 leading-relaxed">
              "Peace comes from within. Do not seek it without."
            </h2>
            <p className="text-lg text-foreground/70 font-light leading-relaxed mb-8">
              True enlightenment is not found in the external world, but by turning inward. Cultivate mindfulness, embrace compassion, and the path will reveal itself to you.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-accent" />
              <p className="font-semibold text-primary uppercase tracking-widest text-sm">
                The Buddha
              </p>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
