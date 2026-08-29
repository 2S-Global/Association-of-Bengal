/**
 * src/models/Election.ts
 * Association elections with nomination, withdrawal, and voting schedules.
 * DO NOT ADD Anything in this model
 */

import mongoose, { Model, Schema } from "mongoose";
import type { ElectionStatus } from "@/types/Election";

// ── Reusable sub-schema: a date+time window ───────────────────────────────────
const scheduleWindowSchema = new Schema(
  {
    startDate: {
      type: String,
      required: true,
      trim: true, // stored as "YYYY-MM-DD" string
    },

    startTime: {
      type: String,
      required: true,
      trim: true, // stored as "9:00 AM" string
    },

    endDate: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

// ── Main Election interface ──────────────────────────────────────────────────
export interface IElection {
  name: string;
  description?: string;

  postDesignations: string[];

  nomination: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };

  withdrawal: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };

  voting: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };

  wings: string[];

  location?: string;

  rulesAndRegulations: string[];

  status: ElectionStatus;

  createdBy?: mongoose.Types.ObjectId | null;

  createdAt?: Date;
  updatedAt?: Date;

  isVotingOpen?: boolean;
}

// ── Main Election schema ──────────────────────────────────────────────────────
const ElectionSchema = new Schema<IElection>(
  {
    name: {
      type: String,
      required: [true, "Election name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    /** Designations / posts members can be nominated for */
    postDesignations: {
      type: [String],
      default: [],
    },

    /** Schedule windows */
    nomination: {
      type: scheduleWindowSchema,
      required: [true, "Nomination schedule is required"],
    },

    withdrawal: {
      type: scheduleWindowSchema,
      required: [true, "Withdrawal schedule is required"],
    },

    voting: {
      type: scheduleWindowSchema,
      required: [true, "Voting schedule is required"],
    },

    /** Which association wings are eligible */
    wings: {
      type: [String],
      default: [],
    },

    /** Venue / city */
    location: {
      type: String,
      trim: true,
    },

    rulesAndRegulations: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "active", "suspended", "completed", "cancelled"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
ElectionSchema.index({ status: 1 });
ElectionSchema.index({ "voting.startDate": 1 });
ElectionSchema.index({ wings: 1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────

/**
 * True when the election is currently in its active voting window
 */
ElectionSchema.virtual("isVotingOpen").get(function () {
  const now = new Date();

  if (!this.voting?.startDate || !this.voting?.endDate) {
    return false;
  }

  const start = new Date(this.voting.startDate);
  const end = new Date(this.voting.endDate);

  return now >= start && now <= end;
});

// ── Model ─────────────────────────────────────────────────────────────────────
const Election: Model<IElection> =
  mongoose.models.Election ||
  mongoose.model<IElection>("Election", ElectionSchema);

export default Election;
