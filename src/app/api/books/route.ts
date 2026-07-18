import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";
import "@/models/Category"; // Import Category model to prevent MissingSchemaError during populate

// GET all Books
export async function GET() {
  try {
    await connectToDatabase();
    const books = await Book.find({}).populate("category").sort({ order: 1, createdAt: -1 });
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
    
    // Assign order
    if (body.order === undefined) {
      const highestOrderBook = await Book.findOne({ category: body.category || null }).sort({ order: -1 });
      body.order = highestOrderBook ? highestOrderBook.order + 1 : 0;
    }

    const newBook = await Book.create({ ...body, slug });
    return NextResponse.json({ success: true, data: newBook }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT to bulk reorder books
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { items } = await req.json(); // Array of { id, order, category (optional) }
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Items array is required" }, { status: 400 });
    }

    const bulkOps = items.map((item: any) => {
      const updateData: any = { order: item.order };
      if (item.category !== undefined) {
        updateData.category = item.category;
      }
      return {
        updateOne: {
          filter: { _id: item.id },
          update: { $set: updateData }
        }
      };
    });

    await Book.bulkWrite(bulkOps);
    return NextResponse.json({ success: true, message: "Books reordered successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
