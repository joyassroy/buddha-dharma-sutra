import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  titleEn: string;
  titleBn?: string;
  author: string;
  description?: string;
  coverImage?: string;
  fileUrl: string;
  slug: string;
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
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Book) {
  delete mongoose.models.Book;
}

export default mongoose.model<IBook>("Book", BookSchema);
