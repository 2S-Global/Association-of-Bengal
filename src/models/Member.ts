import mongoose, { Model, Schema } from "mongoose";

export interface IMember {
  user?: mongoose.Types.ObjectId;
  memberId?: string;
  fullName: string;
  photoUrl?: string;
  photoPublicId?: string;
  wings?: string[];
  location?: {
    country?: string;
    [key: string]: unknown;
  };
  verified?: boolean;
  verifiedAt?: Date | null;
  totalContributions?: number;
  isActive?: boolean;
  memberSince?: number;
}

const MemberSchema = new Schema<IMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    memberId: {
      type: String,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    photoUrl: {
      type: String,
      default: "",
    },

    photoPublicId: {
      type: String,
      default: "",
    },

    wings: {
      type: [String],
      default: [],
    },

    location: {
      type: Schema.Types.Mixed,
      default: {},
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    totalContributions: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    memberSince: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "members",
  }
);

const Member: Model<IMember> =
  mongoose.models.Member ||
  mongoose.model<IMember>("Member", MemberSchema);

export default Member;