import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET a specific Sutra by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const sutra = await Sutra.findById(id);
    if (!sutra) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, data: sutra }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch sutra" }, { status: 500 });
  }
}

// UPDATE a Sutra
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    // If writer is updating, reset status to pending
    if ((session.user as any).role === "writer") {
      body.status = "pending";
    }
    
    // Update slug if titleEn changes
    if (body.titleEn) {
      body.slug = body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const updatedSutra = await Sutra.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedSutra) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedSutra }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE a Sutra
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const deletedSutra = await Sutra.findByIdAndDelete(id);
    if (!deletedSutra) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete sutra" }, { status: 400 });
  }
}
