import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by order ascending
    const categories = await Category.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Determine the next order number if not provided
    if (body.order === undefined) {
      const highestOrder = await Category.findOne().sort({ order: -1 });
      body.order = highestOrder ? highestOrder.order + 1 : 0;
    }

    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  // Bulk update for reordering categories
  try {
    await connectToDatabase();
    const { items } = await req.json(); // Array of { id, order }
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Items array is required" }, { status: 400 });
    }

    const bulkOps = items.map((item: any) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));

    await Category.bulkWrite(bulkOps);
    return NextResponse.json({ success: true, message: "Categories reordered successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
