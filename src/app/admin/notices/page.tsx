"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Megaphone, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Notice {
  _id: string;
  message: string;
  link?: string;
  isActive: boolean;
  urgency: "info" | "warning" | "urgent";
  createdAt: string;
}

export default function NoticesAdmin() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.success) {
        setNotices(data.data);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(currentStatus ? "Notice deactivated" : "Notice activated");
        fetchNotices(); // Refresh list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Notice deleted");
        fetchNotices();
      } else {
        toast.error("Failed to delete notice");
      }
    } catch (error) {
      toast.error("Error deleting notice");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Notices</h1>
          <p className="text-gray-500">Manage announcement banners on the homepage</p>
        </div>
        
        <Link 
          href="/admin/notices/new"
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Notice
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Megaphone size={48} className="text-gray-200 mb-4" />
            <h3 className="text-xl font-serif text-gray-700 mb-2">No Notices Found</h3>
            <p className="text-gray-500 mb-6">Create a notice to display announcements on the homepage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notices.map((notice) => (
                  <tr key={notice._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleStatus(notice._id, notice.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          notice.isActive 
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {notice.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {notice.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{notice.message}</div>
                      {notice.link && (
                        <a href={notice.link} target="_blank" className="text-xs text-primary hover:underline mt-1 inline-block">
                          {notice.link}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        notice.urgency === 'urgent' ? 'bg-red-50 text-red-700' :
                        notice.urgency === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {notice.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/notices/new?id=${notice._id}`}
                          className="text-gray-400 hover:text-primary transition-colors p-1"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteNotice(notice._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
