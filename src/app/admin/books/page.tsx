"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Library, GripVertical, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Category = {
  _id: string;
  name: string;
};

type Book = {
  _id: string;
  titleEn: string;
  titleBn: string;
  author: string;
  fileUrl: string;
  category: Category | null;
  order: number;
};

// Sortable Item Component
function SortableBookRow({ 
  book, 
  onDelete, 
}: { 
  book: Book; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative" as const,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${isDragging ? "shadow-lg" : ""}`}>
      <td className="px-4 py-4 w-12 text-center text-gray-400">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:text-primary hover:bg-primary/10 rounded">
          <GripVertical size={20} />
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{book.titleEn}</div>
        {book.titleBn && <div className="text-sm text-gray-500">{book.titleBn}</div>}
      </td>
      <td className="px-6 py-4 text-gray-600">{book.author}</td>
      <td className="px-6 py-4">
        {book.category ? (
          <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
            {book.category.name}
          </span>
        ) : (
          <span className="text-xs text-gray-400 italic">Uncategorized</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-500">
        <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate inline-block max-w-[100px]">
          View File
        </a>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2 relative z-20">
          <Link 
            href={`/admin/books/new?id=${book._id}`}
            className="text-gray-400 hover:text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </Link>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(book._id); }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ManageBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchBooks();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories");
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // We can only reliably drag-and-drop within the currently filtered view
    // so we reorder the visually displayed list, then map back to the main list.
    const displayedBooks = books.filter(b => 
      selectedCategory === "all" ? true : 
      selectedCategory === "uncategorized" ? !b.category : 
      b.category?._id === selectedCategory
    );

    const oldIndex = displayedBooks.findIndex((b) => b._id === active.id);
    const newIndex = displayedBooks.findIndex((b) => b._id === over.id);
    
    const newDisplayedOrder = arrayMove(displayedBooks, oldIndex, newIndex);
    
    // Update local state immediately for snappy UI
    // To update the global books array, we map the updated orders
    const newBooksList = [...books];
    newDisplayedOrder.forEach((displayedBook, idx) => {
      const globalIndex = newBooksList.findIndex(b => b._id === displayedBook._id);
      if (globalIndex !== -1) {
        newBooksList[globalIndex].order = idx;
      }
    });
    
    // Sort the global array to match the new order for the active filter
    // (This is a simplified approach. In a production app, you might want a more robust sorting logic if dealing with multiple categories at once).
    setBooks(newBooksList.sort((a, b) => a.order - b.order));
    
    // Prepare API payload
    const itemsToUpdate = newDisplayedOrder.map((b, index) => ({ id: b._id, order: index }));
    
    setIsSavingOrder(true);
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToUpdate })
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      toast.success("Sequence updated!");
    } catch (error) {
      toast.error("Failed to save sequence");
      fetchBooks(); // Revert on failure
    } finally {
      setIsSavingOrder(false);
    }
  };

  const filteredBooks = books.filter(b => 
    selectedCategory === "all" ? true : 
    selectedCategory === "uncategorized" ? !b.category : 
    b.category?._id === selectedCategory
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-serif">Manage Library</h1>
          <p className="text-gray-500">Drag books to reorder them (filter by category first for best results)</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-full md:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
            <option value="uncategorized">Uncategorized</option>
          </select>
          <Link 
            href="/admin/books/new" 
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden md:inline">Add Book</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {isSavingOrder && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 overflow-hidden z-50">
            <div className="h-full bg-primary animate-pulse w-1/3"></div>
          </div>
        )}
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading library...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Library size={48} className="text-gray-300 mb-4" />
            <p>No books found in this category.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table className="w-full text-left table-fixed">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 font-medium w-16 text-center">Drag</th>
                  <th className="px-6 py-4 font-medium">Book Title</th>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium w-40">Category</th>
                  <th className="px-6 py-4 font-medium w-24">Link</th>
                  <th className="px-6 py-4 font-medium text-right w-32">Actions</th>
                </tr>
              </thead>
              <SortableContext items={filteredBooks.map(b => b._id)} strategy={verticalListSortingStrategy}>
                <tbody className="divide-y divide-gray-100">
                  {filteredBooks.map((book) => (
                    <SortableBookRow 
                      key={book._id} 
                      book={book} 
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        )}
      </div>
    </div>
  );
}
