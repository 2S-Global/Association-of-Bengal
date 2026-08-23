import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVote extends Document {
  election: mongoose.Types.ObjectId;
  voter: mongoose.Types.ObjectId;
  nominations: mongoose.Types.ObjectId[];
  castAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    election: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    voter: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },

    nominations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Nomination",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
