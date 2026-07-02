"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Edit2, Check, X } from "lucide-react";
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
  slug: string;
  order: number;
};

// Sortable Item Component
function SortableCategoryRow({ 
  category, 
  onDelete, 
  onEdit 
}: { 
  category: Category; 
  onDelete: (id: string) => void;
  onEdit: (category: Category) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

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
      <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
      <td className="px-6 py-4 text-gray-500 font-mono text-sm">{category.slug}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 relative z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(category); }}
            className="text-gray-400 hover:text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(category._id); }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  
  // Create/Edit State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ name, slug: generateSlug(name) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;
    
    const loadingToast = toast.loading(editingId ? "Updating category..." : "Creating category...");
    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Category updated" : "Category created", { id: loadingToast });
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "", slug: "" });
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to save category", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error saving category", { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? If books are assigned to this category, deletion will fail.")) return;
    
    const loadingToast = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((c) => c._id !== id));
        toast.success("Category deleted", { id: loadingToast });
      } else {
        toast.error(data.error || "Failed to delete", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error deleting category", { id: loadingToast });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c._id === active.id);
    const newIndex = categories.findIndex((c) => c._id === over.id);
    
    const newCategories = arrayMove(categories, oldIndex, newIndex);
    // Update local state immediately for snappy UI
    setCategories(newCategories);
    
    // Calculate new orders (0 to N)
    const itemsToUpdate = newCategories.map((c, index) => ({ id: c._id, order: index }));
    
    setIsSavingOrder(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToUpdate })
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      toast.success("Sequence updated!");
    } catch (error) {
      toast.error("Failed to save sequence");
      fetchCategories(); // Revert on failure
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-serif mb-1">Categories</h1>
          <p className="text-gray-500">Manage library categories and drag to reorder them</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setFormData({ name: "", slug: "" }); setEditingId(null); setShowForm(true); }}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Category
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Category" : "New Category"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Category Name</label>
              <input type="text" required value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Tripitaka" />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <input type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors w-full md:w-auto h-[46px] flex items-center justify-center gap-2">
              <Check size={18} />
              Save
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {isSavingOrder && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 overflow-hidden z-50">
            <div className="h-full bg-primary animate-pulse w-1/3"></div>
          </div>
        )}
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found. Create one above!</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table className="w-full text-left table-fixed">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 font-medium w-16 text-center">Drag</th>
                  <th className="px-6 py-4 font-medium w-1/2">Category Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium text-right w-32">Actions</th>
                </tr>
              </thead>
              <SortableContext items={categories.map(c => c._id)} strategy={verticalListSortingStrategy}>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <SortableCategoryRow 
                      key={category._id} 
                      category={category} 
                      onDelete={handleDelete}
                      onEdit={(cat) => {
                        setEditingId(cat._id);
                        setFormData({ name: cat.name, slug: cat.slug });
                        setShowForm(true);
                      }}
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
