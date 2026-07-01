import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";
import Link from "next/link";
import { ArrowRight, Library as LibraryIcon } from "lucide-react";

import LibrarySearch from "@/components/LibrarySearch";

export const metadata = {
  title: "Dharma Library | Buddha Dharma Sutra",
  description: "Explore our digital library of Buddhist books, translations, and guides.",
};

async function getBooks() {
  await connectToDatabase();
  const books = await Book.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(books));
}

export default async function LibraryPage() {
  const books = await getBooks();

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4">Digital Archive</span>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 tracking-tighter">Dharma Library</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-serif italic leading-relaxed">
            A growing collection of digital books and sacred texts. Read online or download to continue your journey.
          </p>
        </div>
      </div>

      {/* Fuzzy Search & Library Grid */}
      <LibrarySearch initialBooks={books} />
    </div>
  );
}
