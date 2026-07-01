"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Library } from "lucide-react";
import toast from "react-hot-toast";

type Book = {
  _id: string;
  titleEn: string;
  titleBn: string;
  author: string;
  fileUrl: string;
};

export default function ManageBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    
    const loadingToast = toast.loading("Deleting book...");
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBooks(books.filter((b) => b._id !== id));
        toast.success("Book deleted successfully", { id: loadingToast });
      } else {
        toast.error("Failed to delete book", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error deleting book", { id: loadingToast });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-serif">Manage Library</h1>
        <Link 
          href="/admin/books/new" 
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add New Book
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading library...</div>
        ) : books.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Library size={48} className="text-gray-300 mb-4" />
            <p>No books found. Click "Add New Book" to create one.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Book Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">PDF Link</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{book.titleEn}</div>
                    {book.titleBn && <div className="text-sm text-gray-500">{book.titleBn}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{book.author}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate inline-block max-w-[150px]">
                      View File
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleDelete(book._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
