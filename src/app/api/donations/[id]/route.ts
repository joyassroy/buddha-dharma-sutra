import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import DonationRequest from "@/models/DonationRequest";
import Donor from "@/models/Donor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const request = await DonationRequest.findById(id);
    if (!request) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    // If changing status to approved, we should also automatically add them to the Donors list
    if (body.status === "approved" && request.status !== "approved") {
      await Donor.create({
        name: request.name,
        amount: request.amount
      });
    }

    request.status = body.status;
    await request.save();

    return NextResponse.json({ success: true, data: request });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

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
    const { id } = await params;

    const deletedRequest = await DonationRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
