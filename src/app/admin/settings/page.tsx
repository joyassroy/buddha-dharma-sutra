"use client";

import { useState, useEffect } from "react";
import { Save, Settings2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    contactEmail: "",
    donationNumber: "",
    aboutText: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setFormData({
          siteName: data.data.siteName || "",
          contactEmail: data.data.contactEmail || "",
          donationNumber: data.data.donationNumber || "",
          aboutText: data.data.aboutText || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Saving settings...");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!", { id: loadingToast });
      } else {
        toast.error("Failed to save: " + data.error, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Settings2 size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 font-serif">Site Settings</h1>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex gap-3 text-blue-800">
        <ShieldAlert className="shrink-0 mt-0.5" size={20} />
        <p className="text-sm">
          <strong>Note:</strong> These settings control the content shown across the public website. Changes made here will be visible to all users immediately after saving.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* General Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site Name</label>
              <input 
                type="text" name="siteName" value={formData.siteName} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Buddha Dharma Sutra"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contact Email</label>
              <input 
                type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>

        {/* Donations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4">Donation Settings</h2>
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium text-gray-700">bKash / Upay Number</label>
            <input 
              type="text" name="donationNumber" value={formData.donationNumber} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. 01700000000"
            />
            <p className="text-xs text-gray-500 mt-1">This number will be shown in the donation modal.</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4">About Information</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Short Description</label>
            <textarea 
              name="aboutText" value={formData.aboutText} onChange={handleChange} rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Write a short description about this project..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" disabled={saving}
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
