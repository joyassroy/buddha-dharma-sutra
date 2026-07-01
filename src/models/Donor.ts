import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the donor's name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    amount: {
      type: String,
      required: [true, "Please provide the donation amount"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);
