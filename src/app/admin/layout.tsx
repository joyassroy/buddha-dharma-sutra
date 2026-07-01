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
  Settings, 
  LogOut,
  Heart,
  Wallet,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Sutras", href: "/admin/sutras", icon: BookOpen },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Books", href: "/admin/books", icon: Library },
    { name: "Donors", href: "/admin/donors", icon: Heart },
    { name: "Requests", href: "/admin/donations", icon: Wallet },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2 outline-none">
          <div className="w-8 h-8 relative flex-shrink-0 bg-white rounded-full p-0.5 shadow-sm border border-primary/10">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold tracking-tight text-primary">Admin</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto
        ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 outline-none">
            <div className="w-8 h-8 relative flex-shrink-0 bg-white rounded-full p-0.5 shadow-sm border border-primary/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">Admin Panel</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close drawer on click
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-gray-500"} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden min-h-[calc(100vh-4rem)] md:min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
