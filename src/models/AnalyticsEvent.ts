import mongoose, { Schema, Document } from "mongoose";

export interface IAnalyticsEvent extends Document {
  eventType: string; // "PAGE_VIEW", "SEARCH", "CLICK"
  path: string;
  details?: string;
  deviceId?: string;
  createdAt: Date;
}

const AnalyticsEventSchema: Schema = new Schema(
  {
    eventType: { type: String, required: true },
    path: { type: String, required: true },
    details: { type: String, default: "" },
    deviceId: { type: String, default: "" },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
  }
);

// We can add an index to automatically expire events after 30 days to save DB space
AnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
