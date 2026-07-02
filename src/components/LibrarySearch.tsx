"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, Library as LibraryIcon, Filter } from "lucide-react";
import Fuse from "fuse.js";

interface Category {
  _id: string;
  name: string;
  slug: string;
  order: number;
}

interface BookType {
  _id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  author: string;
  coverImage?: string;
  description?: string;
  category?: Category;
  order: number;
}

export default function LibrarySearch({ 
  initialBooks, 
  categories 
}: { 
  initialBooks: BookType[], 
  categories: Category[] 
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Setup Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(initialBooks, {
      keys: ["titleEn", "titleBn", "author", "description", "category.name"],
      threshold: 0.4, // Allows for typos and fuzzy matching
      includeScore: true,
    });
  }, [initialBooks]);

  // Filter books based on query and selected category
  const displayBooks = useMemo(() => {
    let filtered = initialBooks;
    
    // Apply search query first
    if (query) {
      const results = fuse.search(query);
      filtered = results.map(result => result.item);
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "uncategorized") {
        filtered = filtered.filter(b => !b.category);
      } else {
        filtered = filtered.filter(b => b.category?._id === selectedCategory);
      }
    }
    
    return filtered;
  }, [query, selectedCategory, fuse, initialBooks]);

  // Group books by category for rendering
  const groupedBooks = useMemo(() => {
    // If user is searching or filtering by a specific category, just show a flat list 
    // or group it anyway? Grouping looks nicer.
    const groups: { categoryName: string; categoryOrder: number; books: BookType[] }[] = [];
    
    // Create groups based on available categories
    categories.forEach(cat => {
      const catBooks = displayBooks.filter(b => b.category?._id === cat._id);
      if (catBooks.length > 0) {
        groups.push({
          categoryName: cat.name,
          categoryOrder: cat.order,
          books: catBooks
        });
      }
    });
    
    // Add uncategorized
    const uncategorized = displayBooks.filter(b => !b.category);
    if (uncategorized.length > 0) {
      groups.push({
        categoryName: "Other Books",
        categoryOrder: 9999, // Always at the bottom
        books: uncategorized
      });
    }
    
    // Sort groups by category order
    return groups.sort((a, b) => a.categoryOrder - b.categoryOrder);
    
  }, [displayBooks, categories]);

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
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const BookCard = ({ book }: { book: BookType }) => (
    <Link href={`/library/${book.slug}`} className="group block">
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
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Search & Filter Bar */}
      <div className="max-w-3xl mx-auto mb-16 flex flex-col md:flex-row shadow-lg shadow-gray-200/50 rounded-2xl md:rounded-full bg-white border border-gray-100 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-100 transition-all hover:shadow-xl hover:shadow-gray-200/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
        
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors, or topics..."
            className="w-full pl-14 pr-6 py-4 md:py-5 bg-transparent border-none focus:outline-none focus:ring-0 transition-all font-serif text-gray-800 text-lg placeholder:text-gray-400"
          />
        </div>

        <div className="relative group w-full md:w-64 bg-gray-50/30 hover:bg-gray-50/80 transition-colors">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <Filter size={20} />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-12 pr-12 py-4 md:py-5 bg-transparent border-none focus:outline-none focus:ring-0 transition-all font-serif text-gray-800 appearance-none cursor-pointer text-base md:text-lg"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
            <option value="uncategorized">Uncategorized</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

      </div>

      {/* Results */}
      {displayBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <Search className="text-gray-300" size={24} />
          </div>
          <h3 className="text-2xl font-serif text-gray-400 italic">No books found</h3>
          <p className="text-gray-500 mt-2 font-sans text-sm">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="space-y-20">
          {groupedBooks.map((group) => (
            <div key={group.categoryName} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-serif font-bold text-gray-900">{group.categoryName}</h2>
                <div className="h-px bg-gray-200 flex-1 mt-2"></div>
                <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{group.books.length} Books</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {group.books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
