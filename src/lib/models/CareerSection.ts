import mongoose, { Schema, Model, Document } from 'mongoose';

export type SectionType = 'recruitment_process' | 'faq' | 'benefits' | 'general_info';

export interface ICareerSection extends Document {
  sectionType: SectionType;
  title: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSectionSchema = new Schema<ICareerSection>(
  {
    sectionType: {
      type: String,
      required: [true, 'Section type is required'],
      enum: {
        values: ['recruitment_process', 'faq', 'benefits', 'general_info'],
        message: '{VALUE} is not a valid section type',
      },
    },
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
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

// Index for ordering active sections
CareerSectionSchema.index({ displayOrder: 1, isActive: -1 });

// Index for section type
CareerSectionSchema.index({ sectionType: 1, isActive: -1 });

// Prevent model overwrite during hot reload in development
const CareerSection: Model<ICareerSection> = mongoose.models.CareerSection || mongoose.model<ICareerSection>('CareerSection', CareerSectionSchema);

export default CareerSection;
