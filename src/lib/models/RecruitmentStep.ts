import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IRecruitmentStep extends Document {
  sectionId: mongoose.Types.ObjectId;
  stepNumber: number;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruitmentStepSchema = new Schema<IRecruitmentStep>(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Section ID is required'],
      ref: 'CareerSection',
      index: true,
    },
    stepNumber: {
      type: Number,
      required: [true, 'Step number is required'],
      min: [1, 'Step number must be at least 1'],
    },
    title: {
      type: String,
      required: [true, 'Step title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Step description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
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

// Index for ordering steps within a section
RecruitmentStepSchema.index({ sectionId: 1, displayOrder: 1 });

// Index for active steps
RecruitmentStepSchema.index({ sectionId: 1, isActive: -1, displayOrder: 1 });

// Prevent model overwrite during hot reload in development
const RecruitmentStep: Model<IRecruitmentStep> = mongoose.models.RecruitmentStep || mongoose.model<IRecruitmentStep>('RecruitmentStep', RecruitmentStepSchema);

export default RecruitmentStep;
