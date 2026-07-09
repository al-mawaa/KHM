import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICareerFAQ extends Document {
  sectionId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerFAQSchema = new Schema<ICareerFAQ>(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Section ID is required'],
      ref: 'CareerSection',
      index: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      maxlength: [5000, 'Answer cannot exceed 5000 characters'],
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

// Index for ordering FAQs within a section
CareerFAQSchema.index({ sectionId: 1, displayOrder: 1 });

// Index for active FAQs
CareerFAQSchema.index({ sectionId: 1, isActive: -1, displayOrder: 1 });

// Prevent model overwrite during hot reload in development
const CareerFAQ: Model<ICareerFAQ> = mongoose.models.CareerFAQ || mongoose.model<ICareerFAQ>('CareerFAQ', CareerFAQSchema);

export default CareerFAQ;
