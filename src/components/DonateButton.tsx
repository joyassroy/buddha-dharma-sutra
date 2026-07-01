"use client";

import { useState } from "react";
import DonateModal from "./DonateModal";
import { Heart } from "lucide-react";

export default function DonateButton({ bkashNumber }: { bkashNumber: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto"
      >
        <Heart size={20} className="fill-white/20" />
        Donate Now
      </button>

      <DonateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        bkashNumber={bkashNumber} 
      />
    </>
  );
}
