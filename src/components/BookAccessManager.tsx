"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { BookOpen, Download, Lock } from "lucide-react";

interface BookAccessManagerProps {
  fileUrl: string;
  embedUrl: string;
}

export default function BookAccessManager({ fileUrl, embedUrl }: BookAccessManagerProps) {
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex justify-center md:justify-start w-full">
        <div className="animate-pulse bg-gray-200 h-12 w-48 rounded-full"></div>
      </div>
    );
  }

  // 1. Not logged in -> Show Login Required
  if (!session) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full">
        <Link 
          href="/login" 
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
        >
          <Lock size={18} />
          Login to Read or Download
        </Link>
      </div>
    );
  }

  // 2. Logged in, but not verified by Turnstile -> Show Turnstile
  if (!isVerified) {
    return (
      <div className="flex flex-col items-center md:items-start gap-3 w-full animate-fade-in-up">
        <p className="text-sm font-medium text-gray-500 mb-1">
          Security Check: Please verify you are human to access the book.
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white p-1 inline-block">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => {
              // Successfully verified by Cloudflare Turnstile!
              setIsVerified(true);
            }}
            onError={() => {
              console.error("Turnstile error");
            }}
            options={{
              theme: "light",
            }}
          />
        </div>
      </div>
    );
  }

  // 3. Verified -> Show original Download and Read buttons
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full animate-zoom-in opacity-0 forwards">
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-primary/20"
      >
        <Download size={18} />
        Download PDF
      </a>
      <a 
        href={embedUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
      >
        <BookOpen size={18} />
        Read Online
      </a>
    </div>
  );
}
