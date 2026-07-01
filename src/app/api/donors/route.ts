import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donor from "@/models/Donor";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all donors, most recent first
    const donors = await Donor.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: donors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    if (!body.name || !body.amount) {
      return NextResponse.json({ success: false, error: "Name and amount are required" }, { status: 400 });
    }

    const donor = await Donor.create(body);
    return NextResponse.json({ success: true, data: donor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
