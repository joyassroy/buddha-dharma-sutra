import mongoose, { Schema, Document } from "mongoose";

export interface INotice extends Document {
  message: string;
  link?: string;
  isActive: boolean;
  urgency: "info" | "warning" | "urgent";
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema(
  {
    message: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: false },
    urgency: { 
      type: String, 
      enum: ["info", "warning", "urgent"], 
      default: "info" 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
