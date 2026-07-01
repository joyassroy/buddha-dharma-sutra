"use client";

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
  Wallet
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 outline-none">
            <div className="w-8 h-8 relative flex-shrink-0 bg-white rounded-full p-0.5 shadow-sm border border-primary/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
