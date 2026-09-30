import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  full_name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  phone_number: { 
    type: String, 
    default: "" 
  },
  email_address: { 
    type: String, 
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },
  subject: { 
    type: String, 
    required: [true, "Subject is required"] 
  },
  message: { 
    type: String, 
    required: [true, "Message is required"] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Next.js re-runs files on every request in development. 
// This prevents Mongoose from throwing a "Model already exists" error.
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;