import mongoose, { Schema, Document } from "mongoose";

export interface IFolderAlbum extends Document {
  album: string;
  category: string;
  date: string;
  location: string;
  imageUrls: string[]; // Must be an array
  imageAlt: string;
  createdAt: Date;
}

const FolderAlbumSchema: Schema = new Schema<IFolderAlbum>(
  {
    album: { type: String, required: true, index: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    imageUrls: { type: [String], required: true },
    imageAlt: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// If Next.js hot-reloads and caches the old model definition, delete the old model cache:
if (mongoose.models.Gallery) {
  delete mongoose.models.Gallery;
}

export default mongoose.model<IFolderAlbum>("Gallery", FolderAlbumSchema);