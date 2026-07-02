import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const updatedNotice = await Notice.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedNotice) {
      return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNotice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedNotice = await Notice.findByIdAndDelete(id);
    
    if (!deletedNotice) {
      return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
