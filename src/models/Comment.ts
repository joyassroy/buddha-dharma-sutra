import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
