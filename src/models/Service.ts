import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
