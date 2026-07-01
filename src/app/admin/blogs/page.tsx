"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Clock, FileText, Trash2 } from "lucide-react";

type Blog = {
  _id: string;
  titleEn: string;
  status: "pending" | "published" | "rejected";
  createdAt: string;
  authorId: {
    name: string;
    email: string;
    image: string;
  };
};

export default function AdminBlogReview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const loadingToast = toast.loading(`Updating status to ${status}...`);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.map((b) => (b._id === id ? { ...b, status: data.data.status } : b)));
        toast.success(`Blog ${status} successfully`, { id: loadingToast });
      } else {
        toast.error("Failed to update status", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error updating status", { id: loadingToast });
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;
    
    const loadingToast = toast.loading("Deleting blog...");
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b._id !== id));
        toast.success("Blog deleted successfully", { id: loadingToast });
      } else {
        toast.error("Failed to delete blog", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error deleting blog", { id: loadingToast });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-2">Blog Review Queue</h1>
        <p className="text-gray-500">Review, approve, or reject blogs submitted by users.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading blog submissions...</div>
        ) : blogs.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No blogs have been submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <div key={blog._id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                  {blog.authorId?.image ? (
                    <img src={blog.authorId.image} alt="author" className="w-12 h-12 rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">
                      {blog.authorId?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{blog.titleEn}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By <span className="font-medium text-gray-700">{blog.authorId?.name}</span> ({blog.authorId?.email})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <div>
                    {blog.status === "pending" && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>}
                    {blog.status === "published" && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Published</span>}
                    {blog.status === "rejected" && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Rejected</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setExpandedBlogId(expandedBlogId === blog._id ? null : blog._id)}
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FileText size={16} /> {expandedBlogId === blog._id ? "Hide Content" : "Read Content"}
                    </button>
                    
                    {blog.status === "pending" && (
                      <>
                        <button 
                          onClick={() => updateStatus(blog._id, "published")}
                          className="flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(blog._id, "rejected")}
                          className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X size={16} /> Reject
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => deleteBlog(blog._id)}
                      className="flex items-center gap-1 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-2"
                      title="Delete Blog"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content View */}
                {expandedBlogId === blog._id && (
                  <div className="mt-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">English Content</h4>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-serif border-t border-gray-100 pt-2">
                          {(blog as any).contentEn}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Bengali Content</h4>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-serif border-t border-gray-100 pt-2">
                          {(blog as any).contentBn}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
