"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import BuddhistFlag from "./BuddhistFlag";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Sutras", href: "/sutras" },
    { name: "Insights", href: "/blog" },
    { name: "Library", href: "/library" },
    { name: "Donate", href: "/donate" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-primary/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Flag */}
          <Link href="/" className="flex items-center gap-3 outline-none">
            <BuddhistFlag />
            <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-full p-1 shadow-sm border border-primary/10">
              <Image src="/logo.png" alt="Buddha Dharma Sutra Logo" fill className="object-contain p-1" sizes="40px" />
            </div>
            <span className="font-bold text-sm min-[375px]:text-base sm:text-xl text-primary tracking-tight font-serif">
              Buddha Dharma Sutra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions (Lang & Auth) */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
              <Globe size={20} />
              <span className="text-sm font-medium">EN</span>
            </button>
            
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:border-primary/50 transition-all bg-white shadow-sm"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    
                    <Link 
                      href={(session.user as any)?.role === "admin" ? "/admin" : "/dashboard"}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    
                    <button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <User size={18} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground/80 p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-lg border-b border-primary/10"
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-primary/10 flex flex-col gap-4">
              <button className="flex items-center gap-2 px-3 py-2 text-foreground/80 hover:text-primary mb-4">
                <Globe size={20} />
                Switch Language (BN)
              </button>
              
              {session ? (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      href={(session.user as any)?.role === "admin" ? "/admin" : "/dashboard"}
                      className="flex items-center justify-center gap-2 bg-white text-primary w-full px-5 py-3 rounded-xl border border-primary/20 font-medium shadow-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 w-full px-5 py-3 rounded-xl font-medium shadow-sm"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center gap-2 bg-primary text-white w-full px-5 py-3 rounded-full font-medium shadow-md">
                  <User size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
