import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  authorId: mongoose.Types.ObjectId;
  status: "pending" | "published" | "rejected";
  coverImage?: string;
  slug: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    titleEn: { type: String, required: true },
    titleBn: { type: String, required: true },
    contentEn: { type: String, required: true },
    contentBn: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "published", "rejected"], default: "pending" },
    coverImage: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
