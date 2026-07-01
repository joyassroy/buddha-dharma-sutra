"use client";

import { useState, useEffect } from "react";
import { Trash2, CheckCircle2, XCircle, FileText, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/donations");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Request ${status}`);
        fetchRequests();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request permanently?")) return;

    try {
      const res = await fetch(`/api/donations/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Request deleted");
        fetchRequests();
      } else {
        toast.error(data.error || "Failed to delete request");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-serif">Loading requests...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Donation Requests</h1>
          <p className="text-gray-500">Review submissions from users who have donated.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">TrxID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic font-serif">
                    No donation requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{req.name}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{req.phoneNumber}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{req.trxId}</td>
                    <td className="px-6 py-4 text-primary font-medium">{req.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          req.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req._id, "approved")}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve & Add to Donors"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, "rejected")}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
