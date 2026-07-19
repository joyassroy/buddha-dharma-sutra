"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

type Sutra = {
  _id: string;
  titleEn: string;
  titleBn: string;
  source: string;
  status: "pending" | "published" | "rejected";
  submittedBy?: { name: string; email: string };
};

export default function ManageSutras() {
  const [sutras, setSutras] = useState<Sutra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSutras();
  }, []);

  const fetchSutras = async () => {
    try {
      const res = await fetch("/api/sutras?all=true");
      const data = await res.json();
      if (data.success) {
        setSutras(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sutras");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sutra?")) return;
    
    const loadingToast = toast.loading("Deleting sutra...");
    try {
      const res = await fetch(`/api/sutras/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSutras(sutras.filter((s) => s._id !== id));
        toast.success("Sutra deleted successfully", { id: loadingToast });
      } else {
        toast.error("Failed to delete sutra", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error deleting sutra", { id: loadingToast });
    }
  };

  const handleStatusChange = async (id: string, status: "pending" | "published" | "rejected") => {
    const loadingToast = toast.loading(`Marking as ${status}...`);
    try {
      const res = await fetch(`/api/admin/sutras/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSutras(sutras.map(s => s._id === id ? { ...s, status } : s));
        toast.success(`Sutra successfully ${status}`, { id: loadingToast });
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
        <h1 className="text-3xl font-bold text-gray-800 font-serif">Manage Sutras</h1>
        <Link 
          href="/admin/sutras/new" 
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add New Sutra
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading sutras...</div>
        ) : sutras.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No sutras found. Click "Add New Sutra" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">English Title</th>
                  <th className="px-6 py-4 font-medium">Bengali Title</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium w-48">Added By</th>
                  <th className="px-6 py-4 font-medium w-36">Status</th>
                  <th className="px-6 py-4 font-medium text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sutras.map((sutra) => (
                  <tr key={sutra._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{sutra.titleEn}</td>
                    <td className="px-6 py-4 text-gray-600">{sutra.titleBn}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{sutra.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      {sutra.submittedBy ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{sutra.submittedBy.name}</div>
                          <div className="text-xs text-gray-500">{sutra.submittedBy.email}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Admin</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={sutra.status || 'published'}
                        onChange={(e) => handleStatusChange(sutra._id, e.target.value as "pending" | "published" | "rejected")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border-0 cursor-pointer outline-none ring-1 ring-inset focus:ring-2 focus:ring-primary/20 ${
                          sutra.status === 'published' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          sutra.status === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                          'bg-red-50 text-red-700 ring-red-600/20'
                        }`}
                      >
                        <option value="pending" className="bg-white text-gray-900">Pending</option>
                        <option value="published" className="bg-white text-gray-900">Published</option>
                        <option value="rejected" className="bg-white text-gray-900">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/admin/sutras/new?id=${sutra._id}`}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(sutra._id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
