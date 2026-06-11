import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  description?: string;
  category: string;
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
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: ['Projects', 'Treatment Plants', 'Construction', 'Maintenance', 'Events'],
      default: 'Projects',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
