import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICareerGeneralInfo extends Document {
  sectionId: mongoose.Types.ObjectId;
  heading: string;
  content: string;
  images?: Array<{
    url: string;
    publicId: string;
    displayOrder: number;
  }>;
  videoUrl?: string;
  ctaButton?: string;
  ctaLink?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerGeneralInfoSchema = new Schema<ICareerGeneralInfo>(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Section ID is required'],
      ref: 'CareerSection',
      index: true,
    },
    heading: {
      type: String,
      required: [true, 'Heading is required'],
      trim: true,
      maxlength: [300, 'Heading cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    images: {
      type: [{
        url: {
          type: String,
          required: true,
          trim: true,
        },
        publicId: {
          type: String,
          required: true,
          trim: true,
        },
        displayOrder: {
          type: Number,
          required: true,
          default: 0,
        },
      }],
      default: [],
    },
    videoUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Video URL cannot exceed 500 characters'],
    },
    ctaButton: {
      type: String,
      trim: true,
      maxlength: [100, 'CTA button text cannot exceed 100 characters'],
    },
    ctaLink: {
      type: String,
      trim: true,
      maxlength: [500, 'CTA link cannot exceed 500 characters'],
    },
    displayOrder: {
      type: Number,
      required: [true, 'Display order is required'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering general info within a section
CareerGeneralInfoSchema.index({ sectionId: 1, displayOrder: 1 });

// Index for active general info
CareerGeneralInfoSchema.index({ sectionId: 1, isActive: -1, displayOrder: 1 });

// Prevent model overwrite during hot reload in development
const CareerGeneralInfo: Model<ICareerGeneralInfo> = mongoose.models.CareerGeneralInfo || mongoose.model<ICareerGeneralInfo>('CareerGeneralInfo', CareerGeneralInfoSchema);

export default CareerGeneralInfo;
