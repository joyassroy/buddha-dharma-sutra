"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, BookOpen, Library, FileText, ArrowRight } from "lucide-react";

export default function WriterDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[80px] -z-10" />
        
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
          Welcome back, <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
            {session?.user?.name || "Writer"}
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl font-light">
          Your contributions help preserve and spread the timeless wisdom of the Buddha. What would you like to share today?
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-serif mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard 
            title="Submit a Book" 
            desc="Add a new Dhamma book to the library." 
            icon={<Library size={24} />} 
            href="/writer/books/new"
            color="bg-purple-50 text-purple-600"
            hover="hover:border-purple-200 hover:shadow-purple-100"
          />
          <ActionCard 
            title="Add a Sutra" 
            desc="Translate or share a sacred sutra." 
            icon={<BookOpen size={24} />} 
            href="/writer/sutras/new"
            color="bg-blue-50 text-blue-600"
            hover="hover:border-blue-200 hover:shadow-blue-100"
          />
          <ActionCard 
            title="Write a Blog" 
            desc="Share your insights and reflections." 
            icon={<FileText size={24} />} 
            href="/writer/blogs/new"
            color="bg-emerald-50 text-emerald-600"
            hover="hover:border-emerald-200 hover:shadow-emerald-100"
          />
        </div>
      </div>

      {/* Notice */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex gap-4 mt-8 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
          <span className="font-bold text-lg">!</span>
        </div>
        <div>
          <h3 className="font-bold text-orange-800 text-lg">Review Process</h3>
          <p className="text-orange-700/80 mt-1">
            Please note that all Books and Sutras submitted will be reviewed by an Administrator before they are published live on the website. Blogs will be published directly under your name. You can track your submission status in the respective tabs.
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, href, color, hover }: any) {
  return (
    <Link 
      href={href}
      className={`group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${hover} flex flex-col justify-between h-full`}
    >
      <div>
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{desc}</p>
      </div>
      
      <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 transition-all gap-2 mt-auto">
        Get Started <ArrowRight size={16} />
      </div>
    </Link>
  );
}
