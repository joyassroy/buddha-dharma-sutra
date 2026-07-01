"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookHeart, Flame, Globe2 } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 selection:bg-primary/20">

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-8 leading-tight">
            Preserving the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#059669]">Light of Dhamma</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-serif leading-relaxed">
            Our mission is to bring the timeless wisdom of the Buddha into the modern age, making it accessible, beautiful, and profound for everyone.
          </p>
        </motion.div>
      </section>

      {/* Parallax Image / Quote Section */}
      <section className="w-full h-[60vh] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558868540-3b5e8ca26dc2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Monk meditating"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white leading-relaxed drop-shadow-lg">
            "Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared."
          </h2>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <span className="text-primary uppercase tracking-[0.3em] font-bold text-sm">Our Core Pillars</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 text-gray-900">What Drives Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <motion.div
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2rem] bg-white shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <BookHeart size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">Preservation</h3>
            <p className="text-gray-600 leading-relaxed">
              We carefully digitize and present sacred sutras to ensure the Buddha's teachings are never lost and remain pristine for future generations.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2rem] bg-white shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-all duration-300 delay-100"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Globe2 size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">Accessibility</h3>
            <p className="text-gray-600 leading-relaxed">
              Wisdom should not be hidden behind physical barriers. We aim to translate and share the Dhamma with a global audience effortlessly.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2rem] bg-white shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-all duration-300 delay-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Flame size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">Enlightenment</h3>
            <p className="text-gray-600 leading-relaxed">
              Beyond just reading, we strive to build an environment that fosters inner peace, mindfulness, and the spark of true awakening.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-8">Join the Journey</h2>
          <p className="text-xl text-gray-400 font-serif leading-relaxed mb-12">
            Explore the sutras, read insights from the wise, or contribute to help us spread the light of Dhamma even further.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sutras" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-[#047857] transition-colors">
              Read Sutras
            </Link>
            <Link href="/donate" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors">
              Support Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
