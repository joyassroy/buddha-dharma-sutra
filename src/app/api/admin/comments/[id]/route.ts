import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const { id } = await context.params;
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
