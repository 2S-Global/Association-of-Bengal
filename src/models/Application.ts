
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistoryItem {
  action: string;
  amount?: string;
  remark?: string;
  date: Date;
}

export interface IApplication extends Document {
  participant_name: string;
  participant_bengali?: string;
  participant_address?: string;
  participant_email: string;
  participant_gst?: string;
  participant_head?: string;
  participant_mobile?: string;
  participant_rep?: string;
  space_requirement?: string;
  pan_card_doc?: string;      // 👈 Added
  address_proof_doc?: string; // 👈 Added
  titles_copies?: string;
  stock_value?: string;
  declaration_date?: string;
  declaration_place?: string;
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
    participant_bengali: { type: String, trim: true },
    participant_address: { type: String, trim: true },
    participant_email: { type: String, required: true, lowercase: true, trim: true },
    participant_gst: { type: String, trim: true },
    participant_head: { type: String, trim: true },
    participant_mobile: { type: String, trim: true },
    participant_rep: { type: String, trim: true },
    space_requirement: { type: String, trim: true },
    pan_card_doc: { type: String, trim: true },      // 👈 Added to schema
    address_proof_doc: { type: String, trim: true }, // 👈 Added to schema
    titles_copies: { type: String, trim: true },
    stock_value: { type: String, trim: true },
    declaration_date: { type: String, trim: true },
    declaration_place: { type: String, trim: true },
    status: { type: String, default: "PENDING", uppercase: true, trim: true },
    amount: { type: String, trim: true },
    remark: { type: String, trim: true },
    history: [HistorySchema], 
  },
  { timestamps: true }
);

export default (mongoose.models.Application as Model<IApplication>) ||
  mongoose.model<IApplication>("Application", ApplicationSchema);