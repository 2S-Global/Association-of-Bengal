
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistoryItem {
  action: string;
  amount?: string;
  remark?: string;
  date: Date;
}

export interface IApplication extends Document {
  participant_name: string;
  participant_email: string;
  status: string;
  amount?: string;
  remark?: string;
  history: IHistoryItem[]; 
}

const HistorySchema = new Schema<IHistoryItem>(
  {
    action: { type: String, required: true, uppercase: true },
    amount: { type: String, trim: true },
    remark: { type: String, trim: true },
    date: { type: Date, default: Date.now }, 
  }
);

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    participant_name: { type: String, required: true, trim: true },
    participant_email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, default: "PENDING", uppercase: true, trim: true },
    amount: { type: String, trim: true },
    remark: { type: String, trim: true },
    history: [HistorySchema], 
  },
  { timestamps: true }
);

export default (mongoose.models.Application as Model<IApplication>) ||
  mongoose.model<IApplication>("Application", ApplicationSchema);