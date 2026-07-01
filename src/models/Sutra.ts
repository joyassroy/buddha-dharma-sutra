import mongoose, { Schema, Document } from "mongoose";

export interface ISutra extends Document {
  titleEn?: string;
  titleBn?: string;
  contentPali?: string;
  contentBn?: string;
  source: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const SutraSchema: Schema = new Schema(
  {
    titleEn: { type: String, default: "" },
    titleBn: { type: String, default: "" },
    contentPali: { type: String, default: "" },
    contentBn: { type: String, default: "" },
    source: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Sutra || mongoose.model<ISutra>("Sutra", SutraSchema);
