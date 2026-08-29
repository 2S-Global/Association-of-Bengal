/**
 * src/models/User.ts
 * Authentication user — stores credentials.
 * Linked 1-to-1 with Member profile.
 */

import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export type UserRole = "member" | "admin" | "super_admin";

export interface IUser {
  fullName: string;
  email: string;

  step: number;
  allstep_completed: boolean;

  mobile: string;
  password: string;

  role: UserRole;

  isActive: boolean;

  lastLoginAt?: Date;
  passwordChangedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;

  member?: unknown;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;

  passwordChangedAfter(jwtIssuedAt: number): boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    step: {
      type: Number,
      default: 1,
    },

    allstep_completed: {
      type: Boolean,
      default: false,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["member", "admin", "super_admin"],
      default: "member",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
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

// ── Virtual: member profile ──────────────────────────────────────────────────
UserSchema.virtual("member", {
  ref: "Member",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

// ── Pre-save: hash password ──────────────────────────────────────────────────
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.passwordChangedAt = new Date();
});

// ── Instance method: compare password ─────────────────────────────────────────
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: check if password changed after token ────────────────────
UserSchema.methods.passwordChangedAfter = function (
  jwtIssuedAt: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );

    return jwtIssuedAt < changedTimestamp;
  }

  return false;
};

// ── Remove sensitive fields from JSON output ──────────────────────────────────
UserSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

// ── Model ─────────────────────────────────────────────────────────────────────
const User: UserModel =
  (mongoose.models.User as UserModel | undefined) ||
  mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;
