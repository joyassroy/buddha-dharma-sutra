import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.model<ICategory>("Category", CategorySchema);
