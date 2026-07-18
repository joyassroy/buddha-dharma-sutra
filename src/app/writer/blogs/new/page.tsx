"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function NewBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    contentEn: "",
    contentBn: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Submitting blog for review...");

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Blog submitted successfully! Pending admin approval.", { id: loadingToast });
        router.push("/writer/blogs");
      } else {
        toast.error("Failed to submit: " + data.error, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/writer/blogs" className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Write a New Blog</h1>
          <p className="text-gray-500">Share your wisdom. Your blog will be published once reviewed by our team.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">English Title</label>
            <input 
              required type="text" name="titleEn" value={formData.titleEn} onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-serif text-lg"
              placeholder="The Path to Inner Peace"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Bengali Title</label>
            <input 
              required type="text" name="titleBn" value={formData.titleBn} onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-serif text-lg"
              placeholder="মানসিক শান্তির পথ"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">English Content</label>
          <textarea 
            required name="contentEn" value={formData.contentEn} onChange={handleChange} rows={8}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all leading-relaxed"
            placeholder="Write your article in English here..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Bengali Content</label>
          <textarea 
            required name="contentBn" value={formData.contentBn} onChange={handleChange} rows={8}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all leading-relaxed"
            placeholder="আপনার লেখাটি বাংলায় এখানে লিখুন..."
          />
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" disabled={loading}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50"
          >
            <Send size={20} />
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </div>

      </form>
    </div>
  );
}
