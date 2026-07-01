import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";

// GET all Books
export async function GET() {
  try {
    await connectToDatabase();
    const books = await Book.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 });
  }
}

// POST a new Book
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Simple slug generator fallback
    const baseTitle = body.titleEn || body.titleBn || "untitled-book";
    const slug = baseTitle.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    
    const newBook = await Book.create({ ...body, slug });
    return NextResponse.json({ success: true, data: newBook }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
