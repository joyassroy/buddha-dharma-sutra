import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    if (!["published", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();
    
    const updatedSutra = await Sutra.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSutra) {
      return NextResponse.json({ success: false, error: "Sutra not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSutra });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
