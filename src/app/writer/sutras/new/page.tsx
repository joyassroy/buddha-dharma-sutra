"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

function NewSutraContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    contentPali: "",
    contentBn: "",
    source: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchSutraToEdit();
    }
  }, [isEditing]);

  const fetchSutraToEdit = async () => {
    try {
      const res = await fetch(`/api/sutras/${editId}`);
      const data = await res.json();
      if (data.success) {
        setFormData({
          titleEn: data.data.titleEn || "",
          titleBn: data.data.titleBn || "",
          contentPali: data.data.contentPali || "",
          contentBn: data.data.contentBn || "",
          source: data.data.source || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch sutra data");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(isEditing ? "Updating sutra..." : "Saving sutra...");

    try {
      const url = isEditing ? `/api/sutras/${editId}` : "/api/sutras";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Sutra updated!" : "Sutra saved successfully!", { id: loadingToast });
        router.push("/writer/sutras");
      } else {
        toast.error("Failed to save sutra: " + data.error, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/writer/sutras" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 font-serif">
          {isEditing ? "Edit Sutra" : "Add New Sutra"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">English Title</label>
            <input 
              type="text" name="titleEn" value={formData.titleEn} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. The Dhammapada"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bengali Title</label>
            <input 
              type="text" name="titleBn" value={formData.titleBn} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. ধম্মপদ"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Source / Origin</label>
          <input 
            required type="text" name="source" value={formData.source} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Khuddaka Nikaya"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Pali Content (Verses)</label>
          <textarea 
            name="contentPali" value={formData.contentPali} onChange={handleChange} rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Write the Pali text here..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bengali Content (Verses)</label>
          <textarea 
            name="contentBn" value={formData.contentBn} onChange={handleChange} rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="বাংলা অনুবাদ এখানে লিখুন..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? "Saving..." : isEditing ? "Update Sutra" : "Save Sutra"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function NewSutra() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading form...</div>}>
      <NewSutraContent />
    </Suspense>
  );
}
