import mongoose, { Model, Schema } from "mongoose";

export interface INomination {
  election: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  position: string;
  wing: string;
  manifesto: string;
  agreedToTerms: boolean;
  status: "pending" | "approved" | "rejected";

  // Automatically created by Mongoose because timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

const NominationSchema = new Schema<INomination>(
  {
    election: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    wing: {
      type: String,
      required: true,
      trim: true,
    },

    manifesto: {
      type: String,
      required: true,
      trim: true,
    },

    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "nominations",
  }
);

const Nomination: Model<INomination> =
  mongoose.models.Nomination ||
  mongoose.model<INomination>("Nomination", NominationSchema);

export default Nomination;