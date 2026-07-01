import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  contactEmail: string;
  donationNumber: string;
  aboutText: string;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    siteName: { type: String, default: "Buddha Dharma Sutra" },
    contactEmail: { type: String, default: "contact@example.com" },
    donationNumber: { type: String, default: "" },
    aboutText: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
