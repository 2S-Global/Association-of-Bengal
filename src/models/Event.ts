import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  category: string;
  startDate: string; // Changed to string
  endDate: string;   // Changed to string
  dateStr: string;   // Formatted badge string e.g. "SEP 24, 2026 - NOV 27, 2026"
  location: string;
  description: string;
  image: string;
  status: "Published" | "Draft";
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  startDate: { type: String, required: true }, // Changed to String
  endDate: { type: String, required: true },     // Changed to String
  dateStr: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=3840&q=95" 
  },
  status: { type: String, enum: ["Published", "Draft"], default: "Published" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);