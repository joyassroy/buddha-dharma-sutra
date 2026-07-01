import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import DonationRequest from "@/models/DonationRequest";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    if (!body.name || !body.phoneNumber || !body.trxId || !body.amount) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    // Check if TrxID already exists
    const existing = await DonationRequest.findOne({ trxId: body.trxId });
    if (existing) {
      return NextResponse.json({ success: false, error: "This Transaction ID has already been submitted" }, { status: 400 });
    }

    const request = await DonationRequest.create(body);
    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "This Transaction ID has already been submitted" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
