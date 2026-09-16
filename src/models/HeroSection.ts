import mongoose, { Document, Schema } from "mongoose";

export interface IHeroSection extends Document {
  badgeText: string;
  welcomeTitle: string;
  tagline: string;
  headline: string;
  description: string;
  heroImage: string;
  eventsPlanned: number;
  registeredMembers: number;
  indianCities: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSectionSchema = new Schema<IHeroSection>(
  {
    badgeText: { type: String, required: true },
    welcomeTitle: { type: String, required: true },
    tagline: { type: String, required: true },
    headline: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    eventsPlanned: { type: Number, required: true },
    registeredMembers: { type: Number, required: true },
    indianCities: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "hero_section" },
);

export default mongoose.models.HeroSection ||
  mongoose.model<IHeroSection>("HeroSection", HeroSectionSchema);
