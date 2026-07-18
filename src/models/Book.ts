import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  titleEn: string;
  titleBn?: string;
  author: string;
  description?: string;
  coverImage?: string;
  fileUrl: string;
  slug: string;
  category?: mongoose.Types.ObjectId;
  order: number;
  status: "pending" | "published" | "rejected";
  submittedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema(
  {
    titleEn: { type: String, required: true },
    titleBn: { type: String, default: "" },
    author: { type: String, required: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "published", "rejected"], default: "published" },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Book) {
  delete mongoose.models.Book;
}

export default mongoose.model<IBook>("Book", BookSchema);
