import { Schema, model, models } from "mongoose";

const SpaceOptionSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const FairConfigSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    fairTitle: { type: String, required: true },
    fairSubtitle: { type: String, required: true },
    fairDates: { type: String, required: true },
    stallSelectionText: { type: String, required: true },
    stallSelectionVenue: { type: String, required: true }, // <--- Already there
    locationName: { type: String, default: "" },             // <--- Add this line here
    tagLabel: { type: String, default: "" },
    organizerName: { type: String, required: true },
    organizerSubtext: { type: String, required: true },
    logoSrc: { type: String, required: true },
    spaceOptions: [SpaceOptionSchema],
    termsAndConditionsHTML: { type: String, required: true },
    fairTimingsText: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.FairConfig || model("FairConfig", FairConfigSchema);