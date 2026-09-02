import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonation extends Document {
  member: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  referenceId: string;
  type?: string;
  amount: number;
  currency: string;
  paymentMethod: "paypal" | "stripe" | "bkash" | "nagad" | "bank_transfer" | "razorpay";
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  razorpayOrderId?: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  transactionId?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referenceId: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1"],
    },
    currency: {
      type: String,
      default: "BDT",
    },
    paymentMethod: {
      type: String,
      enum: ["paypal", "stripe", "bkash", "nagad", "bank_transfer", "razorpay"],
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    paypalOrderId: {
      type: String,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ member: 1, createdAt: -1 });
donationSchema.index({ status: 1 });

donationSchema.pre("validate", function (next: any) {
  const doc = this as IDonation;

  if (!doc.referenceId) {
    const typeSlug = (doc.type || "GEN")
      .slice(0, 3)
      .toUpperCase()
      .replace(/\s/g, "");
    const num = Math.floor(1000 + Math.random() * 9000);
    doc.referenceId = `AL-${typeSlug}-${num}`;
  }
  next();
});

const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", donationSchema);

export default Donation;