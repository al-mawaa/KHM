import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ILifeAtKHM extends Document {
  image: string;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const LifeAtKHMSchema = new Schema<ILifeAtKHM>(
  {
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const LifeAtKHM: Model<ILifeAtKHM> =
  mongoose.models.LifeAtKHM || mongoose.model<ILifeAtKHM>('LifeAtKHM', LifeAtKHMSchema);

export default LifeAtKHM;
