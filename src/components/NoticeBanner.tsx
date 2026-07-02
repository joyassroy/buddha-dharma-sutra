"use client";

import { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notice {
  _id: string;
  message: string;
  link?: string;
  urgency: "info" | "warning" | "urgent";
}

export default function NoticeBanner() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch("/api/notices?active=true");
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          const activeNotice = data.data[0]; // Get the most recent active notice
          
          // Check if user has already dismissed this specific notice
          const dismissedNotices = JSON.parse(localStorage.getItem("dismissedNotices") || "[]");
          if (!dismissedNotices.includes(activeNotice._id)) {
            setNotice(activeNotice);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notice", error);
      }
    };

    fetchNotice();
  }, []);

  const handleDismiss = () => {
    if (!notice) return;
    
    // Save to local storage so it doesn't show again
    const dismissedNotices = JSON.parse(localStorage.getItem("dismissedNotices") || "[]");
    dismissedNotices.push(notice._id);
    localStorage.setItem("dismissedNotices", JSON.stringify(dismissedNotices));
    
    setIsVisible(false);
  };

  if (!notice) return null;

  const bgColors = {
    info: "bg-blue-600",
    warning: "bg-yellow-500",
    urgent: "bg-red-600"
  };

  const Content = (
    <div className={`relative w-full ${bgColors[notice.urgency]} text-white shadow-lg z-40 overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-white/20">
              <Megaphone className="h-5 w-5 text-white animate-pulse" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium text-white truncate md:text-wrap leading-tight text-sm md:text-base">
              {notice.message}
            </p>
          </div>
          
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto flex items-center gap-2">
            {notice.link && (
              <a
                href={notice.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about this notice"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-bold text-[color:var(--tw-gradient-from)] bg-white hover:bg-gray-50 transition-colors"
                style={{ color: notice.urgency === "info" ? "#2563eb" : notice.urgency === "warning" ? "#d97706" : "#dc2626" }}
              >
                Learn more
              </a>
            )}
          </div>
          
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="-mr-1 flex p-2 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.3 } }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-full relative z-50"
        >
          <div className="w-full relative z-50 animate-float" style={{ animationDuration: '3s' }}>
            {Content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
