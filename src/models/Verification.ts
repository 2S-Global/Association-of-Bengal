import mongoose, { Model, Schema } from "mongoose";

export type VerificationType = "mobile" | "aadhaar";

export interface IVerificationSession extends mongoose.Document {
  type: VerificationType;
  memberId?: string | mongoose.Types.ObjectId | null;
  userId?: string | mongoose.Types.ObjectId | null;
  mobile?: string | null;
  mobileHash?: string | null;
  mobileMasked?: string | null;
  aadhaarHash?: string | null;
  aadhaarMasked?: string | null;
  otpHash?: string | null;
  providerRequestId?: string | null;
  expiresAt?: Date | null;
  attempts: number;
  resendCount: number;
  verified: boolean;
  verifiedAt?: Date | null;
  lastSentAt?: Date | null;
  lastProviderMessage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const VerificationSessionSchema = new Schema<IVerificationSession>(
  {
    type: {
      type: String,
      enum: ["mobile", "aadhaar"],
      required: true,
      index: true,
    },
    memberId: {
      type: Schema.Types.Mixed,
    },
    userId: {
      type: Schema.Types.Mixed,
    },
    mobile: {
      type: String,
      trim: true,
    },
    mobileHash: {
      type: String,
      trim: true,
      index: true,
    },
    mobileMasked: {
      type: String,
      trim: true,
    },
    aadhaarHash: {
      type: String,
      trim: true,
      index: true,
    },
    aadhaarMasked: {
      type: String,
      trim: true,
    },
    otpHash: {
      type: String,
      trim: true,
    },
    providerRequestId: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    resendCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    lastSentAt: {
      type: Date,
      default: null,
    },
    lastProviderMessage: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

VerificationSessionSchema.index({ type: 1, mobileHash: 1, createdAt: -1 });
VerificationSessionSchema.index({ type: 1, aadhaarHash: 1, createdAt: -1 });
VerificationSessionSchema.index({ type: 1, memberId: 1, createdAt: -1 });
VerificationSessionSchema.index({ type: 1, userId: 1, createdAt: -1 });

const VerificationSession: Model<IVerificationSession> =
  (mongoose.models.Verification as Model<IVerificationSession> | undefined) ||
  mongoose.model<IVerificationSession>("Verification", VerificationSessionSchema, "verifications");

export default VerificationSession;
