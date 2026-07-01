import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await req.json();
    
    // Generate slug from english title
    const slug = body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const newBlog = await Blog.create({
      ...body,
      authorId: user._id,
      slug,
      status: "pending", // Always default to pending
    });

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
