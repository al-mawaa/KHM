import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  points: string[];
  image?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      default: 'Droplets',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    points: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
