"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Sutra = {
  _id: string;
  titleEn: string;
  titleBn: string;
  source: string;
  status: "pending" | "published" | "rejected";
};

export default function ManageSutras() {
  const [sutras, setSutras] = useState<Sutra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSutras();
  }, []);

  const fetchSutras = async () => {
    try {
      const res = await fetch("/api/sutras?mine=true");
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



  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-serif">My Sutras</h1>
        <Link 
          href="/writer/sutras/new" 
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
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">English Title</th>
                  <th className="px-6 py-4 font-medium">Bengali Title</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                        sutra.status === 'published' ? 'bg-green-50 text-green-700' :
                        sutra.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {sutra.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/writer/sutras/new?id=${sutra._id}`}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
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
