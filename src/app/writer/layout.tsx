"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Library, 
  LogOut,
  Menu,
  X,
  PenTool
} from "lucide-react";

export default function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/writer", icon: LayoutDashboard },
    { name: "My Books", href: "/writer/books", icon: Library },
    { name: "My Sutras", href: "/writer/sutras", icon: BookOpen },
    { name: "My Blogs", href: "/writer/blogs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm">
        <Link href="/" className="flex items-center gap-2 outline-none">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary">
            <PenTool size={18} />
          </div>
          <span className="font-bold tracking-tight text-gray-800 font-serif">Writer Studio</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Writer Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col h-full
        transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:translate-x-0 md:static md:z-auto
        ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="h-16 md:h-24 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 outline-none group">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-primary/20">
              <PenTool size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800 font-serif">Writer Studio</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close drawer on click
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-1" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary hover:translate-x-1"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all font-semibold shadow-sm hover:shadow"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden min-h-[calc(100vh-4rem)] md:min-h-screen relative">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto w-full relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
