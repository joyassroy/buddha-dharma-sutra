"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PenTool, Clock, LogOut, CheckCircle, XCircle, Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Blog = {
  _id: string;
  titleEn: string;
  status: "pending" | "published" | "rejected";
  createdAt: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any).role === "writer") {
        router.push("/writer");
        return;
      }
      fetchUserBlogs();
      setNewName(session.user.name || "");
    }
  }, [session]);

  const fetchUserBlogs = async () => {
    try {
      const res = await fetch("/api/blogs/me");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim() || newName === session?.user?.name) {
      setIsEditingName(false);
      return;
    }

    const loadingToast = toast.loading("Updating name...");
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (data.success) {
        await update({ name: data.data.name });
        toast.success("Name updated successfully!", { id: loadingToast });
        setIsEditingName(false);
      } else {
        toast.error(data.error || "Failed to update name", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error updating name", { id: loadingToast });
    }
  };

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 font-serif">
              Welcome, 
            </h1>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-3xl font-bold text-gray-900 font-serif border-b-2 border-primary focus:outline-none bg-transparent w-48"
                  autoFocus
                />
                <button onClick={handleNameUpdate} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <Save size={20} />
                </button>
                <button onClick={() => { setIsEditingName(false); setNewName(session?.user?.name || ""); }} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-gray-900 font-serif">
                  {session.user?.name}
                </h1>
                <button 
                  onClick={() => setIsEditingName(true)} 
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Edit Name"
                >
                  <Edit2 size={20} />
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600">Manage your insightful writings and track their review status.</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar: Write Action */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-primary to-[#059669] rounded-3xl p-8 text-white shadow-xl shadow-primary/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
              <PenTool size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3">Share Your Insight</h2>
            <p className="text-white/80 mb-8 font-light">
              Write a new blog post. Our editors will review and publish your writing to the world.
            </p>
            <Link 
              href="/dashboard/new-blog"
              className="bg-white text-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-md transform hover:-translate-y-1"
            >
              Start Writing Now
            </Link>
          </div>
        </div>

        {/* Right Section: My Blogs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">My Submissions</h3>
            
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading your writings...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <PenTool size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">You haven't submitted any blogs yet.</p>
                <p className="text-sm text-gray-400 mt-1">Start writing to share your thoughts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog._id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all bg-gray-50/50">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{blog.titleEn}</h4>
                      <p className="text-sm text-gray-500">Submitted on {new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      {blog.status === "pending" && (
                        <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                          <Clock size={16} /> Pending Review
                        </span>
                      )}
                      {blog.status === "published" && (
                        <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                          <CheckCircle size={16} /> Published
                        </span>
                      )}
                      {blog.status === "rejected" && (
                        <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                          <XCircle size={16} /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
