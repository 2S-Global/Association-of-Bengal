/**
 * src/models/Vote.ts
 * A single ballot cast by a member in a specific election.
 * DO NOT ADD Anything in this model
 */

import mongoose, { Model, Schema } from "mongoose";

export interface IVote {
  election: mongoose.Types.ObjectId;
  voter: mongoose.Types.ObjectId;

  /** The nomination(s) / candidate(s) voted for */
  nominations: mongoose.Types.ObjectId[];

  castAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    election: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    voter: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    /** The nomination(s) / candidate(s) voted for */
    nominations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Nomination",
      },
    ],

    castAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

// One member, one vote per election
VoteSchema.index({ election: 1, voter: 1 }, { unique: true });

const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
