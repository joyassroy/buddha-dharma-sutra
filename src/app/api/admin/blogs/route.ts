import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";

// Get all blogs (for admin review)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch all blogs and populate the author info
    const blogs = await Blog.find({}).populate("authorId", "name email image").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}
