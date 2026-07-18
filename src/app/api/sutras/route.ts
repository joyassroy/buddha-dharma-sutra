import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all Sutras
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
        delete filter.status; // Remove the published restriction for writers viewing their own sutras
      }
    }
    const sutras = await Sutra.find(filter).populate("submittedBy", "name email").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sutras }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch sutras" }, { status: 500 });
  }
}

// POST a new Sutra
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
    const baseTitle = body.titleEn || body.titleBn || "untitled";
    const slug = baseTitle.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    const newSutra = await Sutra.create({ ...body, slug });
    return NextResponse.json({ success: true, data: newSutra }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
