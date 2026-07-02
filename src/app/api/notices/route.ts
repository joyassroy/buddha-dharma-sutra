import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    
    await connectToDatabase();
    
    const query = activeOnly ? { isActive: true } : {};
    const notices = await Notice.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: notices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // If the new notice is set to active, deactivate others (optional behavior, but good for singular notice banner)
    // We will let the user have multiple active notices if they want, but typically only one is shown.
    
    const newNotice = await Notice.create(body);
    return NextResponse.json({ success: true, data: newNotice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
