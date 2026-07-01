import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name: name.trim() },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { name: updatedUser.name } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
