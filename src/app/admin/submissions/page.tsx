"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Eye, FileText, Library } from "lucide-react";
import toast from "react-hot-toast";

type PendingItem = {
  _id: string;
  title: string;
  type: "Book" | "Sutra";
  submittedBy: { name: string; email: string };
  date: string;
  url: string;
};

export default function SubmissionsReview() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const [booksRes, sutrasRes] = await Promise.all([
        fetch("/api/books?all=true"),
        fetch("/api/sutras?all=true")
      ]);
      const booksData = await booksRes.json();
      const sutrasData = await sutrasRes.json();

      let pending: PendingItem[] = [];

      if (booksData.success) {
        pending = pending.concat(
          booksData.data
            .filter((b: any) => b.status === "pending")
            .map((b: any) => ({
              _id: b._id,
              title: b.titleEn,
              type: "Book",
              submittedBy: b.submittedBy || { name: "Unknown", email: "N/A" },
              date: new Date(b.createdAt).toLocaleDateString(),
              url: b.fileUrl
            }))
        );
      }

      if (sutrasData.success) {
        pending = pending.concat(
          sutrasData.data
            .filter((s: any) => s.status === "pending")
            .map((s: any) => ({
              _id: s._id,
              title: s.titleEn || s.titleBn,
              type: "Sutra",
              submittedBy: s.submittedBy || { name: "Unknown", email: "N/A" },
              date: new Date(s.createdAt).toLocaleDateString(),
              url: `/sutras/${s.slug}`
            }))
        );
      }

      setItems(pending);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, type: "Book" | "Sutra", status: "published" | "rejected") => {
    const loadingToast = toast.loading(`Marking as ${status}...`);
    try {
      const endpoint = type === "Book" ? `/api/admin/books/${id}/status` : `/api/admin/sutras/${id}/status`;
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(i => i._id !== id));
        toast.success(`Successfully ${status}`, { id: loadingToast });
      } else {
        toast.error("Failed to update status", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error updating status", { id: loadingToast });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-serif">Pending Submissions</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading submissions...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">All caught up!</h3>
            <p className="text-gray-500 mt-2">There are no pending submissions to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium w-32">Type</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Submitted By</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'Book' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {item.type === 'Book' ? <Library size={14} /> : <FileText size={14} />}
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">{item.submittedBy.name}</div>
                      <div className="text-xs text-gray-500">{item.submittedBy.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={item.url} target="_blank" rel="noopener noreferrer"
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors flex items-center justify-center"
                          title="View Content"
                        >
                          <Eye size={18} />
                        </a>
                        <button 
                          onClick={() => handleStatus(item._id, item.type, "published")}
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2 rounded-lg transition-colors flex items-center justify-center"
                          title="Approve & Publish"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatus(item._id, item.type, "rejected")}
                          className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center justify-center"
                          title="Reject"
                        >
                          <X size={18} />
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
