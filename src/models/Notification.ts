import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the TypeScript interface for the document
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  icon: string;
  title: string;
  message: string;
  type: "event" | "verification" | "finance" | "system" | "announcement";
  isRead: boolean;
  readAt?: Date | null;
  actionUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose Schema
const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      default: "notifications",
    },
    title: {
      type: String,
      required: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["event", "verification", "finance", "system", "announcement"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    actionUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// ── Next.js Model Initialization ──────────────────────────────
const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;