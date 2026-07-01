import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";

// GET all Sutras
export async function GET() {
  try {
    await connectToDatabase();
    const sutras = await Sutra.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sutras }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch sutras" }, { status: 500 });
  }
}

// POST a new Sutra
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Simple slug generator fallback
    const baseTitle = body.titleEn || body.titleBn || "untitled";
    const slug = baseTitle.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    const newSutra = await Sutra.create({ ...body, slug });
    return NextResponse.json({ success: true, data: newSutra }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
