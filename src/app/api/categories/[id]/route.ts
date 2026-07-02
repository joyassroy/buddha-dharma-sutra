import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Book from "@/models/Book";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Check if there are any books in this category before deleting
    const booksCount = await Book.countDocuments({ category: id });
    if (booksCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete category. ${booksCount} books are still assigned to it.` 
      }, { status: 400 });
    }

    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
