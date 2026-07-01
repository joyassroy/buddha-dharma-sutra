import mongoose from "mongoose";

const DonationRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide the phone number used to send money"],
      trim: true,
    },
    trxId: {
      type: String,
      required: [true, "Please provide the Transaction ID"],
      trim: true,
      unique: true,
    },
    amount: {
      type: String,
      required: [true, "Please provide the donated amount"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.DonationRequest || mongoose.model("DonationRequest", DonationRequestSchema);
