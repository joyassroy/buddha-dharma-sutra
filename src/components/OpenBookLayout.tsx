"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
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
      <div className="max-w-5xl w-full pt-10 animate-fade-in-up opacity-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            <div className="animate-fade-in-right opacity-0 delay-200">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight tracking-tight">
                Awaken Your <br className="hidden md:block" />
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
                <Link href="/mission" className="px-8 py-3.5 rounded-full font-medium text-foreground border border-foreground/10 hover:bg-foreground/5 transition-all">
                  Our Mission
                </Link>
              </div>
            </div>
          </div>

          {/* Premium Hero Image */}
          <div className="flex-1 relative w-full max-w-sm animate-zoom-in opacity-0 delay-300">
            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white/50 backdrop-blur-sm">
              <Image
                src="/hero-image.png"
                alt="Glowing Bodhi Leaf"
                fill
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-primary/10 animate-float z-10 max-w-[calc(100%-2rem)] sm:max-w-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex shrink-0 items-center justify-center text-accent">
                <BookOpen size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
              </div>
              <div className="truncate">
                <p className="text-[10px] sm:text-xs text-foreground/60 font-semibold uppercase tracking-wider">Collection</p>
                <p className="font-bold text-sm sm:text-base text-foreground font-serif truncate">10,000+ Sutras</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wisdom Gallery Section */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Wisdom in Focus</h2>
            <p className="text-gray-500 mt-2 font-serif italic">Timeless teachings for modern lives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
            <WisdomCard
              imageSrc="https://images.unsplash.com/photo-1513415564515-763d91423bdd?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fallbackImg="https://images.unsplash.com/photo-1513415564515-763d91423bdd?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              quote="Radiate boundless love towards the entire world."
              delay={0.4}
            />
            <WisdomCard
              imageSrc="https://images.unsplash.com/photo-1609745772921-f520289e9618?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fallbackImg="https://images.unsplash.com/photo-1609745772921-f520289e9618?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              quote="The mind is everything. What you think you become."
              delay={0.5}
            />
            <WisdomCard
              imageSrc="https://images.unsplash.com/photo-1553285207-a28928d5cc82?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fallbackImg="https://images.unsplash.com/photo-1553285207-a28928d5cc82?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              quote="No matter how hard the past, you can always begin again."
              delay={0.6}
            />
          </div>
        </div>

        {/* Buddha Quotes Section */}
        <QuotesSection />
      </div>
    </div>
  );
}

function WisdomCard({
  imageSrc,
  fallbackImg,
  quote,
  delay,
}: {
  imageSrc: string;
  fallbackImg: string;
  quote: string;
  delay: number;
}) {
  const delayClass = delay === 0.4 ? 'delay-400' : delay === 0.5 ? 'delay-500' : 'delay-600';
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Wisdom quote: ${quote}`}
      className={`group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer animate-fade-in-up opacity-0 ${delayClass}`}
    >
      <Image
        src={imageSrc}
        alt="Buddha Wisdom Background"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none">
        <div className="w-8 h-8 mb-4 opacity-50">
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14.017 21L16.411 14.182C17.399 11.235 17.5 9.424 16.5 8.125C15.5 6.825 13 7.375 13 7.375C13 7.375 14.5 4.5 17.5 4.5C20.5 4.5 22.5 7.5 22.5 11C22.5 14.5 20.003 18.23 18.5 21H14.017ZM5.017 21L7.411 14.182C8.399 11.235 8.5 9.424 7.5 8.125C6.5 6.825 4 7.375 4 7.375C4 7.375 5.5 4.5 8.5 4.5C11.5 4.5 13.5 7.5 13.5 11C13.5 14.5 11.003 18.23 9.5 21H5.017Z" />
          </svg>
        </div>
        <p className="text-white font-serif text-xl leading-relaxed font-medium drop-shadow-md">
          {quote}
        </p>
      </div>
    </div>
  );
}
