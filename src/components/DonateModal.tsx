"use client";

import { useState } from "react";
import { X, Copy, Smartphone, Heart, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  bkashNumber: string;
}

export default function DonateModal({ isOpen, onClose, bkashNumber }: DonateModalProps) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    trxId: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    toast.success("Number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/donations/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thank you! Your donation request has been submitted for review.");
        onClose();
        setFormData({ name: "", phoneNumber: "", trxId: "", amount: "" });
      } else {
        toast.error(data.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Heart size={24} className="fill-primary/20" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Send Donation</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please send your donation to the number below, then fill out the form so we can acknowledge you.
          </p>

          {/* Number & Copy Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-primary" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">bKash / Upay</p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">{bkashNumber}</p>
              </div>
            </div>
            <button 
              onClick={handleCopy}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm group"
              title="Copy Number"
            >
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500 group-hover:text-primary" />}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
                placeholder="e.g. Joy Roy"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
                  placeholder="Sender's Number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
                  placeholder="e.g. 500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
              <input
                type="text"
                name="trxId"
                value={formData.trxId}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm uppercase"
                placeholder="e.g. 9F3A..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3.5 px-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-md"
            >
              {isSubmitting ? "Submitting..." : "Submit Donation Info"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
