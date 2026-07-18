import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";
import "@/models/Category";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all Books
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const mine = searchParams.get("mine") === "true";
    
    await connectToDatabase();
    
    const filter: any = all ? {} : { status: "published" };
    
    if (mine) {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        filter.submittedBy = (session.user as any).id;
        delete filter.status; // Remove the published restriction for writers viewing their own books
      }
    }
    const books = await Book.find(filter).populate("category").populate("submittedBy", "name email").sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 });
  }
}

// POST a new Book
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const role = (session.user as any).role;
    const userId = (session.user as any).id;
    
    body.submittedBy = userId;
    
    if (role === "writer") {
      body.status = "pending";
    } else if (role === "admin") {
      body.status = "published";
    } else {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    
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
