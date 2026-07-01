import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find the user to get their ObjectId
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const blogs = await Blog.find({ authorId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user blogs" }, { status: 500 });
  }
}
