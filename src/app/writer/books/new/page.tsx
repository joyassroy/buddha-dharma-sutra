"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon, FileText } from "lucide-react";
import toast from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
};

function NewBookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    author: "",
    description: "",
    externalUrl: "",
    category: "",
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchBookToEdit();
    }
  }, [isEditing]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchBookToEdit = async () => {
    try {
      const res = await fetch("/api/books?mine=true");
      const data = await res.json();
      if (data.success) {
        const book = data.data.find((b: any) => b._id === editId);
        if (book) {
          setFormData({
            titleEn: book.titleEn,
            titleBn: book.titleBn || "",
            author: book.author,
            description: book.description || "",
            externalUrl: book.fileUrl.startsWith("http") ? book.fileUrl : "",
            category: book.category?._id || book.category || "",
          });
        }
      }
    } catch (error) {
      toast.error("Failed to fetch book data");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Cloudinary Free Tier Limit is 10MB
    if (type === "pdf" && file.size > 10 * 1024 * 1024) {
      toast.error("File is larger than 10MB. Please use the Google Drive Link option instead.");
      e.target.value = "";
      return;
    }
    
    if (type === "pdf") {
      setPdfFile(file);
      setFormData({ ...formData, externalUrl: "" }); // Clear external URL if file is selected
    }
    if (type === "cover") setCoverFile(file);
  };

  const uploadToCloudinary = async (file: File, resourceType: "image" | "raw" = "image") => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body: data,
    });
    
    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message || "Failed to upload to Cloudinary");
    return result.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !pdfFile && !formData.externalUrl) {
      toast.error("Please select a PDF file or provide a Google Drive link.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(isEditing ? "Updating book..." : "Saving book...");

    try {
      // 1. Get PDF URL (either uploaded or external, or keep existing if editing and no new file)
      let pdfUrl = formData.externalUrl;
      if (pdfFile) {
        toast.loading("Uploading PDF to Cloudinary...", { id: loadingToast });
        pdfUrl = await uploadToCloudinary(pdfFile, "image");
      }
      
      // 2. Upload Cover Image to Cloudinary (if provided)
      let coverUrl = undefined;
      if (coverFile) {
        toast.loading("Uploading cover image to Cloudinary...", { id: loadingToast });
        coverUrl = await uploadToCloudinary(coverFile, "image");
      }

      toast.loading("Saving book details to database...", { id: loadingToast });

      // 3. Save to database
      const finalData: any = {
        ...formData,
      };
      
      // Only attach category if it was selected
      if (!finalData.category) delete finalData.category;
      
      // For new books or if a file was explicitly changed, update fileUrl
      if (pdfUrl || formData.externalUrl || !isEditing) {
        finalData.fileUrl = pdfUrl || formData.externalUrl;
      }
      
      if (coverUrl) {
        finalData.coverImage = coverUrl;
      }

      const url = isEditing ? `/api/books/${editId}` : "/api/books";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Server returned an invalid response.");
      }

      if (data.success) {
        toast.success(isEditing ? "Book updated!" : "Book saved successfully!", { id: loadingToast });
        router.push("/writer/books");
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
        <Link href="/writer/books" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 font-serif">
          {isEditing ? "Edit Book" : "Add New Book"}
        </h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Author <span className="text-red-500">*</span></label>
            <input 
              required type="text" name="author" value={formData.author} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Buddhaghosa"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select 
              name="category" value={formData.category} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 block border-b pb-2">
            PDF Document Source {!isEditing && <span className="text-red-500">*</span>}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Option 1: Upload File (Max 10MB)</label>
              <label className="relative flex items-center w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <FileText size={20} className="text-gray-400 mr-3" />
                <span className="flex-1 text-gray-600 truncate">
                  {pdfFile ? pdfFile.name : (isEditing ? "Leave blank to keep existing" : "Select PDF Document...")}
                </span>
                <input 
                  type="file" accept="application/pdf" className="hidden"
                  onChange={(e) => handleFileChange(e, "pdf")}
                />
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Option 2: Google Drive Link</label>
              <input 
                type="url" name="externalUrl" value={formData.externalUrl} onChange={handleChange}
                disabled={!!pdfFile}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:bg-gray-50"
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
          </div>
        </div>
          
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block border-b pb-2">Book Cover (Optional)</label>
            <label className="relative flex items-center w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <ImageIcon size={20} className="text-gray-400 mr-3" />
              <span className="flex-1 text-gray-600 truncate">
                {coverFile ? coverFile.name : (isEditing ? "Leave blank to keep existing" : "Select Cover Image...")}
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
            {loading ? "Saving..." : isEditing ? "Update Book" : "Save Book"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function NewBook() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading form...</div>}>
      <NewBookContent />
    </Suspense>
  );
}
