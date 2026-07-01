"use client";

import { Link2, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButtons({ title, text }: { title: string, text?: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex items-center gap-3 py-6 mt-8 border-t border-gray-100">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2">Share:</span>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      </a>
      
      <a 
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
      >
        <MessageCircle size={18} />
      </a>

      <button 
        onClick={handleCopyLink}
        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors"
      >
        <Link2 size={18} />
      </button>
    </div>
  );
}
