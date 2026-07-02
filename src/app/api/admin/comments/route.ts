import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    require("@/models/Blog");

    // Fetch all comments, sorted by newest
    const comments = await Comment.find({})
      .sort({ createdAt: -1 })
      .populate("authorId", "name email image isBannedFromCommenting")
      .populate("blogId", "titleEn slug")
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
