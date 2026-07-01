import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
