/**
 * src/models/Member.ts
 * Member profile — linked to User via userId.
 */

import mongoose, { Model, Schema } from "mongoose";

export interface IMember {
  user: mongoose.Types.ObjectId;
  memberId: string;
  fullName: string;

  nid?: string;

  photoUrl?: string | null;
  photoPublicId?: string | null;

  wings: string[];

  location: {
    country: string;
    region?: string;
    district?: string;
  };

  verified: boolean;
  verifiedAt: Date | null;

  memberSince: number;

  totalContributions: number;

  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  donations?: unknown[];
}

const MemberSchema = new Schema<IMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    memberId: {
      type: String,
      unique: true,
      required: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    nid: {
      type: String,
      trim: true,
      select: false,
    },

    photoUrl: {
      type: String,
      default: null,
    },

    // Cloudinary Public ID
    photoPublicId: {
      type: String,
      default: null,
    },

    wings: {
      type: [String],
      default: [],
    },

    location: {
      country: {
        type: String,
        required: [true, "Country is required"],
        default: "India",
      },

      region: {
        type: String,
        trim: true,
      },

      district: {
        type: String,
        trim: true,
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    memberSince: {
      type: Number,
      default: () => new Date().getFullYear(),
    },

    totalContributions: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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
// memberId has unique:true above — no need to duplicate
MemberSchema.index({ wings: 1 });
MemberSchema.index({ "location.country": 1 });
MemberSchema.index({ verified: 1 });

// ── Virtual: donation list ────────────────────────────────────────────────────
MemberSchema.virtual("donations", {
  ref: "Donation",
  localField: "_id",
  foreignField: "member",
});

// ── Model ─────────────────────────────────────────────────────────────────────
const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);

export default Member;
