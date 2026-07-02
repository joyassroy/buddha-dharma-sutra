"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function NoticeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    link: "",
    isActive: true,
    urgency: "info"
  });

  useEffect(() => {
    if (isEditing) {
      fetchNotice();
    }
  }, [id]);

  const fetchNotice = async () => {
    try {
      // The API doesn't have a single GET by ID currently, but we can fetch all and find it,
      // or we can just fetch all and filter since it's a small dataset.
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.success) {
        const notice = data.data.find((n: any) => n._id === id);
        if (notice) {
          setFormData({
            message: notice.message,
            link: notice.link || "",
            isActive: notice.isActive,
            urgency: notice.urgency
          });
        }
      }
    } catch (error) {
      toast.error("Failed to load notice data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(isEditing ? "Updating notice..." : "Creating notice...");

    try {
      const url = isEditing ? `/api/notices/${id}` : "/api/notices";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Notice updated!" : "Notice created!", { id: toastId });
        router.push("/admin/notices");
      } else {
        toast.error(data.error || "Failed to save notice", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/notices" className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {isEditing ? "Edit Notice" : "Create Notice"}
          </h1>
          <p className="text-gray-500">
            {isEditing ? "Update announcement banner details" : "Publish a new announcement banner to the homepage"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Notice Message <span className="text-red-500">*</span></label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            placeholder="e.g., We are organizing a special meditation retreat next month!"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Link URL (Optional)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <p className="text-xs text-gray-500">If provided, the notice will be clickable.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Urgency Level</label>
            <div className="relative">
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none bg-white"
              >
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="urgent">Urgent (Red)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-6 h-6 rounded-md border-2 border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">Active Status</p>
              <p className="text-sm text-gray-500">If active, this notice will be visible on the homepage.</p>
            </div>
          </label>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? "Saving..." : isEditing ? "Update Notice" : "Publish Notice"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NoticeForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading form...</div>}>
      <NoticeFormContent />
    </Suspense>
  );
}
