// // import mongoose, { Schema, Document, Model } from "mongoose";

// // export interface IApplication extends Document {
// //   participant_name: string;
// //   participant_bengali: string;
// //   participant_address: string;
// //   participant_email: string;
// //   participant_gst?: string;
// //   participant_head: string;
// //   participant_mobile: string;
// //   participant_rep: string;
// //   space_requirement: string;
// //   pan_card_doc: string;
// //   address_proof_doc: string;
// //   titles_copies: string;
// //   stock_value: string;
// //   declaration_date: string;
// //   declaration_place: string;
// // }

// // const ApplicationSchema: Schema<IApplication> = new Schema(
// //   {
// //     participant_name: { type: String, required: true, trim: true },
// //     participant_bengali: { type: String, required: true, trim: true },
// //     participant_address: { type: String, required: true, trim: true },
// //     participant_email: { type: String, required: true, lowercase: true, trim: true, index: true },
// //     participant_gst: { type: String, uppercase: true, trim: true },
// //     participant_head: { type: String, required: true, trim: true },
// //     participant_mobile: { type: String, required: true, trim: true },
// //     participant_rep: { type: String, required: true, trim: true },
// //     space_requirement: { type: String, required: true },
// //     pan_card_doc: { type: String, required: true },
// //     address_proof_doc: { type: String, required: true },
// //     titles_copies: { type: String, required: true },
// //     stock_value: { type: String, required: true },
// //     declaration_date: { type: String, required: true },
// //     declaration_place: { type: String, required: true },
// //   },
// //   { timestamps: true }
// // );

// // export default (mongoose.models.Application as Model<IApplication>) ||
// //   mongoose.model<IApplication>("Application", ApplicationSchema);


// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IApplication extends Document {
//   participant_name: string;
//   participant_bengali: string;
//   participant_address: string;
//   participant_email: string;
//   participant_gst?: string;
//   participant_head: string;
//   participant_mobile: string;
//   participant_rep: string;
//   space_requirement: string;
//   pan_card_doc: string;
//   address_proof_doc: string;
//   titles_copies: string;
//   stock_value: string;
//   declaration_date: string;
//   declaration_place: string;
//   status?: string; // Added to track ACCEPTED / REJECTED
// }

// const ApplicationSchema: Schema<IApplication> = new Schema(
//   {
//     participant_name: { type: String, required: true, trim: true },
//     participant_bengali: { type: String, required: true, trim: true },
//     participant_address: { type: String, required: true, trim: true },
//     participant_email: { type: String, required: true, lowercase: true, trim: true, index: true },
//     participant_gst: { type: String, uppercase: true, trim: true },
//     participant_head: { type: String, required: true, trim: true },
//     participant_mobile: { type: String, required: true, trim: true },
//     participant_rep: { type: String, required: true, trim: true },
//     space_requirement: { type: String, required: true },
//     pan_card_doc: { type: String, required: true },
//     address_proof_doc: { type: String, required: true },
//     titles_copies: { type: String, required: true },
//     stock_value: { type: String, required: true },
//     declaration_date: { type: String, required: true },
//     declaration_place: { type: String, required: true },
//     status: { type: String, default: "PENDING" }, // Added default status
//   },
//   { timestamps: true }
// );

// export default (mongoose.models.Application as Model<IApplication>) ||
//   mongoose.model<IApplication>("Application", ApplicationSchema);




import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  participant_name: string;
  participant_bengali: string;
  participant_address: string;
  participant_email: string;
  participant_gst?: string;
  participant_head: string;
  participant_mobile: string;
  participant_rep: string;
  space_requirement: string;
  pan_card_doc: string;
  address_proof_doc: string;
  titles_copies: string;
  stock_value: string;
  declaration_date: string;
  declaration_place: string;
  status: string;         // Tracks "PENDING", "ACCEPTED", or "REJECTED"
  amount?: string;        // Stores the payable amount when accepted
  remark?: string;        // Stores the admin remarks or rejection reasons
}

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    participant_name: { type: String, required: true, trim: true },
    participant_bengali: { type: String, required: true, trim: true },
    participant_address: { type: String, required: true, trim: true },
    participant_email: { type: String, required: true, lowercase: true, trim: true, index: true },
    participant_gst: { type: String, uppercase: true, trim: true },
    participant_head: { type: String, required: true, trim: true },
    participant_mobile: { type: String, required: true, trim: true },
    participant_rep: { type: String, required: true, trim: true },
    space_requirement: { type: String, required: true },
    pan_card_doc: { type: String, required: true },
    address_proof_doc: { type: String, required: true },
    titles_copies: { type: String, required: true },
    stock_value: { type: String, required: true },
    declaration_date: { type: String, required: true },
    declaration_place: { type: String, required: true },
    status: { type: String, default: "PENDING", uppercase: true, trim: true },
    amount: { type: String, trim: true },
    remark: { type: String, trim: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Application as Model<IApplication>) ||
  mongoose.model<IApplication>("Application", ApplicationSchema);