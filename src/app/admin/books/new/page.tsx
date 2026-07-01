"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function NewBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    author: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "pdf") setPdfFile(file);
    if (type === "cover") setCoverFile(file);
  };

  const uploadToDrive = async (file: File) => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });
    
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to upload to Google Drive");
    }
    
    return result.url;
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data,
    });
    
    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message || "Failed to upload to Cloudinary");
    return result.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Uploading PDF to Google Drive... This may take a minute.");

    try {
      // 1. Upload PDF to Google Drive
      const pdfUrl = await uploadToDrive(pdfFile);
      
      // 2. Upload Cover Image to Cloudinary (if provided)
      let coverUrl = "";
      if (coverFile) {
        toast.loading("Uploading cover image to Cloudinary...", { id: loadingToast });
        coverUrl = await uploadToCloudinary(coverFile);
      }

      toast.loading("Saving book details to database...", { id: loadingToast });

      // 3. Save to database
      const finalData = {
        ...formData,
        fileUrl: pdfUrl,
        coverImage: coverUrl,
      };

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Book saved successfully!", { id: loadingToast });
        router.push("/admin/books");
      } else {
        toast.error("Failed to save book: " + data.error, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/books" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 font-serif">Add New Book (Direct Upload)</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">English Title <span className="text-red-500">*</span></label>
            <input 
              required type="text" name="titleEn" value={formData.titleEn} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. The Path of Purification"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bengali Title (Optional)</label>
            <input 
              type="text" name="titleBn" value={formData.titleBn} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. বিশুদ্ধিমগ্গ"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Author <span className="text-red-500">*</span></label>
          <input 
            required type="text" name="author" value={formData.author} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Buddhaghosa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Upload PDF File <span className="text-red-500">*</span></label>
            <label className="relative flex items-center w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <FileText size={20} className="text-gray-400 mr-3" />
              <span className="flex-1 text-gray-600 truncate">
                {pdfFile ? pdfFile.name : "Select PDF Document..."}
              </span>
              <input 
                type="file" accept="application/pdf" className="hidden"
                onChange={(e) => handleFileChange(e, "pdf")}
              />
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Upload Cover Image (Optional)</label>
            <label className="relative flex items-center w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <ImageIcon size={20} className="text-gray-400 mr-3" />
              <span className="flex-1 text-gray-600 truncate">
                {coverFile ? coverFile.name : "Select Cover Image..."}
              </span>
              <input 
                type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFileChange(e, "cover")}
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Short Description (Optional)</label>
          <textarea 
            name="description" value={formData.description} onChange={handleChange} rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Write a short description about this book..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <UploadCloud size={20} className="animate-bounce" /> : <Save size={20} />}
            {loading ? "Uploading & Saving..." : "Save Book"}
          </button>
        </div>

      </form>
    </div>
  );
}
