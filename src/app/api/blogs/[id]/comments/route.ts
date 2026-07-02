import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";
import Blog from "@/models/Blog";
import DOMPurify from "isomorphic-dompurify";
import { rateLimit } from "@/lib/rate-limit";

// GET all comments for a blog
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // We also need to populate author details
    require("@/models/User");

    const { id } = await context.params;
    
    const comments = await Comment.find({ blogId: id })
      .sort({ createdAt: -1 })
      .populate("authorId", "name image email isBannedFromCommenting")
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST a new comment
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting (Max 5 comments per minute per IP/User)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userIdentifier = session.user.email || ip;
    const isAllowed = rateLimit(`comment_${userIdentifier}`, 5, 60 * 1000); // 5 requests per minute

    if (!isAllowed) {
      return NextResponse.json({ success: false, error: "Too many comments. Please wait a minute." }, { status: 429 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.isBannedFromCommenting) {
      return NextResponse.json({ success: false, error: "You have been banned from commenting by the administrator." }, { status: 403 });
    }

    const { id } = await context.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: "Comment content is required" }, { status: 400 });
    }

    // Sanitize input to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content.trim());

    if (!sanitizedContent) {
       return NextResponse.json({ success: false, error: "Invalid comment content" }, { status: 400 });
    }

    const newComment = await Comment.create({
      blogId: id,
      authorId: user._id,
      content: sanitizedContent
    });

    // Populate before returning so the UI can display the user's details immediately
    const populatedComment = await Comment.findById(newComment._id).populate("authorId", "name image").lean();

    return NextResponse.json({ success: true, data: populatedComment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
