import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  category: string;
  image: string;
  albumName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    albumName: {
      type: String,
      required: [true, 'Album name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
