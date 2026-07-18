"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide Navbar and Footer on /admin and /writer routes
  const isPanelRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/writer");

  return (
    <div className={`min-h-full flex flex-col ${isPanelRoute ? "" : "pt-20"} bg-background text-foreground`}>
      {!isPanelRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isPanelRoute && <Footer />}
    </div>
  );
}
