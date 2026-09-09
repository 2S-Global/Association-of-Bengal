import mongoose, { Schema, model, models } from "mongoose";

const ComplaintSchema = new Schema(
    {
        trackingId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        membershipId: { type: String, required: true },
        category: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, default: "PENDING" },
        adminReply: { type: String, default: "" }, // Direct single reply from admin

        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

if (models.Complaint) {
    delete models.Complaint;
}

const Complaint = model("Complaint", ComplaintSchema);
export default Complaint;