import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICareerBenefit extends Document {
  sectionId: mongoose.Types.ObjectId;
  iconUrl?: string;
  iconPublicId?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerBenefitSchema = new Schema<ICareerBenefit>(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Section ID is required'],
      ref: 'CareerSection',
      index: true,
    },
    iconUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Icon URL cannot exceed 500 characters'],
    },
    iconPublicId: {
      type: String,
      trim: true,
      maxlength: [500, 'Icon Public ID cannot exceed 500 characters'],
    },
    title: {
      type: String,
      required: [true, 'Benefit title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Benefit description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [100, 'Button text cannot exceed 100 characters'],
    },
    buttonLink: {
      type: String,
      trim: true,
      maxlength: [500, 'Button link cannot exceed 500 characters'],
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

// Index for ordering benefits within a section
CareerBenefitSchema.index({ sectionId: 1, displayOrder: 1 });

// Index for active benefits
CareerBenefitSchema.index({ sectionId: 1, isActive: -1, displayOrder: 1 });

// Prevent model overwrite during hot reload in development
const CareerBenefit: Model<ICareerBenefit> = mongoose.models.CareerBenefit || mongoose.model<ICareerBenefit>('CareerBenefit', CareerBenefitSchema);

export default CareerBenefit;
