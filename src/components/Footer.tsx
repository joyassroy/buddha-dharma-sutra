"use client";

import Link from "next/link";
import { BookOpen, Mail, Heart, Globe, Phone } from "lucide-react";
import BuddhistFlag from "./BuddhistFlag";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground pt-16 pb-8 border-t border-primary/20 relative overflow-hidden">
      {/* Subtle background glow for footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-gradient-to-t from-primary/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Intro */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 outline-none">
              <BuddhistFlag />
              <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-full p-1 shadow-sm border border-primary/10">
                <Image src="/logo.png" alt="Buddha Dharma Sutra Logo" fill className="object-contain p-1" sizes="40px" />
              </div>
              <span className="font-bold text-2xl tracking-tight font-serif">
                Buddha Dharma Sutra
              </span>
            </Link>
            <p className="text-foreground/80 max-w-md leading-relaxed mb-6 font-light">
              A digital sanctuary for the profound teachings of the Buddha. 
              Explore sacred sutras, profound insights, and a vast library of Dhamma books to guide your spiritual journey.
            </p>
            <div className="flex gap-4">
              <SocialIcon href="mailto:jbhe382@gmail.com" icon={<Mail size={20} />} aria-label="Email us" />
              <SocialIcon href="tel:+8801403926676" icon={<Phone size={20} />} aria-label="Call us" />
              <SocialIcon href="https://joyassroy-barua.me" icon={<Globe size={20} />} aria-label="Developer Portfolio" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary font-serif">Explore</h3>
            <ul className="space-y-3">
              <FooterLink href="/sutras" label="Sutras Collection" />
              <FooterLink href="/blog" label="Bhikkhu's Insights" />
              <FooterLink href="/library" label="E-Book Library" />
              <FooterLink href="/about" label="About The Project" />
            </ul>
          </div>

          {/* Action / Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary font-serif">Support Us</h3>
            <p className="text-foreground/80 text-sm mb-4 font-light">
              Your donations help us maintain this platform and spread the Dhamma worldwide.
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#059669] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
            >
              <Heart size={18} className="fill-white" />
              Donate Now
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60 text-sm font-light">
            &copy; {new Date().getFullYear()} Buddha Dharma Sutra. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/60 font-light">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group font-light"
      >
        <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:w-2 transition-all" />
        {label}
      </Link>
    </li>
  );
}
