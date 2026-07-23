import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IManagementTeamBanner extends Document {
  imageUrl: string;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManagementTeamBannerSchema = new Schema<IManagementTeamBanner>(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
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
const ManagementTeamBanner: Model<IManagementTeamBanner> =
  mongoose.models.ManagementTeamBanner || mongoose.model<IManagementTeamBanner>('ManagementTeamBanner', ManagementTeamBannerSchema);

export default ManagementTeamBanner;
