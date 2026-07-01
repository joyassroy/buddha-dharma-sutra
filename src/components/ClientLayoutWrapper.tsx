"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide Navbar and Footer on /admin routes and its subroutes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className={`min-h-full flex flex-col ${isAdminRoute ? "" : "pt-20"} bg-background text-foreground`}>
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
