import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { id } = await context.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    // Initialize likes array if it doesn't exist (for older blogs)
    if (!blog.likes) {
      blog.likes = [];
    }

    // Check if user already liked
    const hasLiked = blog.likes.some((id: any) => id.toString() === user._id.toString());

    if (hasLiked) {
      // Unlike
      blog.likes = blog.likes.filter((userId: any) => userId.toString() !== user._id.toString());
    } else {
      // Like
      blog.likes.push(user._id);
    }

    await blog.save();

    return NextResponse.json({ 
      success: true, 
      isLiked: !hasLiked, 
      likesCount: blog.likes.length 
    });

  } catch (error: any) {
    console.error("Like toggle error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
