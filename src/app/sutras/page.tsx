import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SutraSearch from "@/components/SutraSearch";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sacred Sutras",
  description: "Read and explore the sacred teachings of the Buddha in English and Bengali.",
};

async function getSutras() {
  await connectToDatabase();
  const sutras = await Sutra.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(sutras));
}

export default async function SutrasPage() {
  const sutras = await getSutras();

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4">Library of Wisdom</span>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 tracking-tighter">The Sacred Sutras</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-serif italic leading-relaxed">
            Explore the profound teachings of the Buddha. These timeless discourses offer guidance on the path to liberation and inner peace.
          </p>
        </div>
      </div>

      {/* Fuzzy Search & Sutras List */}
      <SutraSearch initialSutras={sutras} />
    </div>
  );
}
