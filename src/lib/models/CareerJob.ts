import mongoose, { Schema, Model, Document } from 'mongoose';

export type EmploymentType = 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
export type JobStatus = 'Open' | 'Closed';

export interface ICareerJob extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceRequired?: string;
  salaryRange?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  numberOfOpenings?: number;
  applicationDeadline?: Date;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CareerJobSchema = new Schema<ICareerJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: {
        values: ['Full Time', 'Part Time', 'Contract', 'Internship'],
        message: '{VALUE} is not a valid employment type',
      },
    },
    experienceRequired: {
      type: String,
      trim: true,
      maxlength: [100, 'Experience required cannot exceed 100 characters'],
    },
    salaryRange: {
      type: String,
      trim: true,
      maxlength: [100, 'Salary range cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    responsibilities: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.every((item) => item.length <= 500);
        },
        message: 'Each responsibility cannot exceed 500 characters',
      },
    },
    requirements: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.every((item) => item.length <= 500);
        },
        message: 'Each requirement cannot exceed 500 characters',
      },
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.every((item) => item.length <= 100);
        },
        message: 'Each skill cannot exceed 100 characters',
      },
    },
    numberOfOpenings: {
      type: Number,
      min: [1, 'Number of openings must be at least 1'],
      max: [1000, 'Number of openings cannot exceed 1000'],
    },
    applicationDeadline: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return v > new Date();
        },
        message: 'Application deadline must be in the future',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering open jobs
CareerJobSchema.index({ status: 1, createdAt: -1 });

// Index for department filtering
CareerJobSchema.index({ department: 1, status: 1 });

// Index for location filtering
CareerJobSchema.index({ location: 1, status: 1 });

// Index for employment type filtering
CareerJobSchema.index({ employmentType: 1, status: 1 });

// Index for search
CareerJobSchema.index({ title: 'text', department: 'text', skills: 'text' });

// Prevent model overwrite during hot reload in development
const CareerJob: Model<ICareerJob> = mongoose.models.CareerJob || mongoose.model<ICareerJob>('CareerJob', CareerJobSchema);

export default CareerJob;
