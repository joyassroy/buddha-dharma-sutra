"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, Library as LibraryIcon } from "lucide-react";
import Fuse from "fuse.js";

interface BookType {
  _id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  author: string;
  coverImage?: string;
  description?: string;
}

export default function LibrarySearch({ initialBooks }: { initialBooks: BookType[] }) {
  const [query, setQuery] = useState("");

  // Setup Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(initialBooks, {
      keys: ["titleEn", "titleBn", "author", "description"],
      threshold: 0.4, // Allows for typos and fuzzy matching
      includeScore: true,
    });
  }, [initialBooks]);

  // Filter books based on query
  const filteredBooks = useMemo(() => {
    if (!query) return initialBooks;
    
    const results = fuse.search(query);
    return results.map(result => result.item);
  }, [query, fuse, initialBooks]);

  // Track search query with a debounce
  useEffect(() => {
    if (!query || query.length < 3) return;

    const timeoutId = setTimeout(() => {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "SEARCH",
          path: "/library",
          details: query.toLowerCase(),
        }),
      }).catch(() => {});
    }, 1500); // Wait 1.5 seconds after typing stops before logging

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-16 relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, or topics..."
          className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-serif shadow-sm text-gray-800 text-lg placeholder:text-gray-400"
        />
      </div>

      {/* Results */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <Search className="text-gray-300" size={24} />
          </div>
          <h3 className="text-2xl font-serif text-gray-400 italic">No books found matching "{query}"</h3>
          <p className="text-gray-500 mt-2 font-sans text-sm">Try adjusting your search terms or checking for spelling mistakes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredBooks.map((book) => (
            <Link href={`/library/${book.slug}`} key={book._id} className="group block">
              <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden bg-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_50px_rgba(5,150,105,0.15)] transition-all duration-500 group-hover:-translate-y-2">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.titleEn} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 p-6 text-center">
                    <LibraryIcon size={48} className="text-primary/20 mb-4" />
                    <span className="font-serif text-xl font-bold text-gray-900 leading-tight">{book.titleEn}</span>
                    <span className="font-sans text-sm text-gray-500 mt-2">{book.author}</span>
                  </div>
                )}
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="px-2">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                  {book.titleEn}
                </h2>
                <h3 className="text-lg font-serif text-gray-500 italic mb-2 line-clamp-1">
                  {book.titleBn}
                </h3>
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 truncate pr-4">
                    {book.author}
                  </p>
                  <span className="text-primary group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
