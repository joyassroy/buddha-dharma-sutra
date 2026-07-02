import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const { id } = await context.params;
    const targetUser = await User.findById(id);

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Toggle ban status
    targetUser.isBannedFromCommenting = !targetUser.isBannedFromCommenting;
    await targetUser.save();

    return NextResponse.json({ 
      success: true, 
      message: targetUser.isBannedFromCommenting ? "User banned from commenting" : "User unbanned",
      isBannedFromCommenting: targetUser.isBannedFromCommenting
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
