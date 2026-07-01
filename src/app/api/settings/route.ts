import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    // We only ever have one settings document
    let settings = await Settings.findOne({});
    
    // If no settings exist yet, create default
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Only admins can update settings
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    let settings = await Settings.findOne({});
    if (settings) {
      // Update existing
      settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true });
    } else {
      // Create new
      settings = await Settings.create(body);
    }

    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
