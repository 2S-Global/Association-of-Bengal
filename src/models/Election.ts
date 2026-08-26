import mongoose, { Model, Schema } from "mongoose";
import type { ElectionStatus } from "@/types/Election";

export interface IElection {
  name: string;
  description?: string;
  postDesignations: string[];
  nomination: { startDate: string; startTime: string; endDate: string; endTime: string };
  withdrawal: { startDate: string; startTime: string; endDate: string; endTime: string };
  voting: { startDate: string; startTime: string; endDate: string; endTime: string };
  wings: string[];
  location: string;
  rulesAndRegulations: string[];
  status: ElectionStatus;
}

const electionPeriodSchema = new Schema(
  {
    startDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endDate: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const ElectionSchema = new Schema<IElection>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    postDesignations: { type: [String], required: true },
    nomination: { type: electionPeriodSchema, required: true },
    withdrawal: { type: electionPeriodSchema, required: true },
    voting: { type: electionPeriodSchema, required: true },
    wings: { type: [String], required: true },
    location: { type: String, required: true, trim: true },
    rulesAndRegulations: { type: [String], required: true },
    status: {
      type: String,
      enum: ["active", "suspended", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Election: Model<IElection> =
  mongoose.models.Election || mongoose.model<IElection>("Election", ElectionSchema);

export default Election;
