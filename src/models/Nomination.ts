/**
 * src/models/Nomination.ts
 * A candidate nomination filed for a specific election.
 * DO NOT ADD Anything in this model
 */

import mongoose, { Model, Schema } from "mongoose";

export interface INomination {
  election: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;

  /** Post / designation the candidate is contesting for */
  position: string;

  /** Candidate's wing at the time of nomination */
  wing?: string;

  /** Candidate vision / manifesto */
  manifesto?: string;

  /** Whether the candidate accepted the election code of conduct */
  agreedToTerms: boolean;

  /**
   * Admin-controlled approval:
   * pending  → submitted, awaiting review
   * approved → eligible for voting ballot
   * rejected → not eligible
   * withdrawn → candidate withdrew
   */
  status: "pending" | "approved" | "rejected" | "withdrawn";

  createdAt?: Date;
  updatedAt?: Date;
}

const NominationSchema = new Schema<INomination>(
  {
    election: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    /** Post / designation the candidate is contesting for */
    position: {
      type: String,
      required: [true, "Contesting position is required"],
      trim: true,
    },

    /** Candidate's wing at the time of nomination */
    wing: {
      type: String,
      trim: true,
    },

    /** Candidate vision / manifesto */
    manifesto: {
      type: String,
      trim: true,
      maxlength: [2000, "Manifesto cannot exceed 2000 characters"],
    },

    /** Whether the candidate accepted the election code of conduct */
    agreedToTerms: {
      type: Boolean,
      default: false,
    },

    /**
     * Admin-controlled approval:
     * pending  → submitted, awaiting review
     * approved → eligible for voting ballot
     * rejected → not eligible
     * withdrawn → candidate withdrew
     */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "withdrawn"],
      default: "pending",
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

// One member can nominate for one position per election
NominationSchema.index({ election: 1, member: 1 }, { unique: true });

NominationSchema.index({
  election: 1,
  status: 1,
});

const Nomination: Model<INomination> =
  mongoose.models.Nomination ||
  mongoose.model<INomination>("Nomination", NominationSchema);

export default Nomination;
