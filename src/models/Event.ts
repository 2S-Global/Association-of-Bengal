// import mongoose, { Schema, Document } from "mongoose";

// export interface IEvent extends Document {
//   title: string;
//   category: string;
//   startDate: string; // Changed to string
//   endDate: string;   // Changed to string
//   dateStr: string;   // Formatted badge string e.g. "SEP 24, 2026 - NOV 27, 2026"
//   location: string;
//   description: string;
//   image: string;
//   status: "Published" | "Draft";
//   createdAt: Date;
// }

// const EventSchema: Schema = new Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   startDate: { type: String, required: true }, // Changed to String
//   endDate: { type: String, required: true },     // Changed to String
//   dateStr: { type: String, required: true },
//   location: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { 
//     type: String, 
//     default: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=3840&q=95" 
//   },
//   status: { type: String, enum: ["Published", "Draft"], default: "Published" },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);



/**
 * src/models/Event.ts
 * Party events with RSVP tracking and extended properties.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRsvp {
  member: Types.ObjectId;
  rsvpAt: Date;
}

export interface IEvent extends Document {
  title: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  type?: 'convention' | 'gala' | 'summit' | 'workshop' | 'rally' | 'other';
  category?: string;
  // RESTORED TO ORIGINAL OBJECT STRUCTURE
  location: {
    venue: string;
    city?: string;
    country?: string;
  };
  eventDate: Date;
  startDate?: string;
  endDate?: string;
  dateStr?: string;
  rsvpEnabled: boolean;
  rsvpDeadline?: Date;
  rsvpList: IRsvp[];
  isPublished: boolean;
  status?: 'Published' | 'Draft';
  createdBy?: Types.ObjectId;
  rsvpCount: number; // Virtual
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: { type: String, default: null },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=3840&q=95',
    },
    type: {
      type: String,
      enum: ['convention', 'gala', 'summit', 'workshop', 'rally', 'other'],
      default: 'other',
    },
    category: { type: String, trim: true },
    
    // RESTORED TO ORIGINAL OBJECT STRUCTURE
    location: {
      venue: { type: String, required: true },
      city: { type: String },
      country: { type: String, default: 'INDIA' },
    },
    
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startDate: { type: String },
    endDate: { type: String },
    dateStr: { type: String },
    rsvpEnabled: { type: Boolean, default: true },
    rsvpDeadline: { type: Date },
    rsvpList: [
      {
        member: { type: Schema.Types.ObjectId, ref: 'Member' },
        rsvpAt: { type: Date, default: Date.now },
      },
    ],
    isPublished: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['Published', 'Draft'],
      default: 'Published',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.index({ eventDate: 1 });
eventSchema.index({ isPublished: 1 });

eventSchema.virtual('rsvpCount').get(function () {
  return this.rsvpList ? this.rsvpList.length : 0;
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;