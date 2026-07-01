import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donor from "@/models/Donor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Await params if using Next.js 15+ convention for dynamic routes
    const { id } = await params;

    const deletedDonor = await Donor.findByIdAndDelete(id);
    
    if (!deletedDonor) {
      return NextResponse.json({ success: false, error: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
