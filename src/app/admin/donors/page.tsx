"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Donor Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await fetch("/api/donors");
      const data = await res.json();
      if (data.success) {
        setDonors(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch donors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("Please fill in both name and amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Donor added successfully");
        setName("");
        setAmount("");
        fetchDonors();
      } else {
        toast.error(data.error || "Failed to add donor");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;

    try {
      const res = await fetch(`/api/donors/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Donor deleted");
        fetchDonors();
      } else {
        toast.error(data.error || "Failed to delete donor");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-serif">Loading donors...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Donors List</h1>
          <p className="text-gray-500">Manage the people who have contributed to the project.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add New Donor Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              Add New Donor
            </h2>
            
            <form onSubmit={handleAddDonor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  placeholder="e.g. $50 or 500 BDT"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Donor"}
              </button>
            </form>
          </div>
        </div>

        {/* Donors List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-700">All Donors ({donors.length})</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {donors.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic font-serif">
                  No donors added yet.
                </div>
              ) : (
                donors.map((donor: any) => (
                  <div key={donor._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{donor.name}</h4>
                      <p className="text-primary font-medium">{donor.amount}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(donor._id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Donor"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
