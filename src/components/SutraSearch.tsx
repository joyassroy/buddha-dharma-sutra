"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import Fuse from "fuse.js";

interface SutraType {
  _id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  source: string;
}

export default function SutraSearch({ initialSutras }: { initialSutras: SutraType[] }) {
  const [query, setQuery] = useState("");

  // Setup Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(initialSutras, {
      keys: ["titleEn", "titleBn", "source"],
      threshold: 0.4, // Allows for typos and fuzzy matching
      includeScore: true,
    });
  }, [initialSutras]);

  // Filter sutras based on query
  const filteredSutras = useMemo(() => {
    if (!query) return initialSutras;
    
    const results = fuse.search(query);
    return results.map(result => result.item);
  }, [query, fuse, initialSutras]);

  // Track search query with a debounce
  useEffect(() => {
    if (!query || query.length < 3) return;

    const timeoutId = setTimeout(() => {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "SEARCH",
          path: "/sutras",
          details: query.toLowerCase(),
        }),
      }).catch(() => {});
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-16 relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sutras by title or source..."
          className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-serif shadow-sm text-gray-800 text-lg placeholder:text-gray-400"
        />
      </div>

      {/* Results */}
      {filteredSutras.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <Search className="text-gray-300" size={24} />
          </div>
          <h3 className="text-2xl font-serif text-gray-400 italic">No sutras found matching "{query}"</h3>
          <p className="text-gray-500 mt-2 font-sans text-sm">Try adjusting your search terms or checking for spelling mistakes.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredSutras.map((sutra: any, index: number) => (
            <Link href={`/sutras/${sutra.slug}`} key={sutra._id} className="group block border-b border-gray-100 last:border-0 py-12 transition-all duration-500 hover:bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12 px-4 md:px-8">
                {/* Number (We can just use index here, though it changes on search. Better to just use index so it always numbers the list correctly) */}
                <div className="text-gray-300 font-serif text-3xl italic w-12 shrink-0 group-hover:text-accent transition-colors duration-500">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-500 leading-tight">
                    {sutra.titleEn}
                  </h2>
                  <h3 className="text-xl md:text-2xl font-serif text-gray-500 italic mb-6">
                    {sutra.titleBn}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>Source: {sutra.source}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-primary group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-2">
                      Read Text <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
