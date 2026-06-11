import mongoose, { Schema, Model, Document } from 'mongoose';
import { ICareerJob } from './CareerJob';

export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Interview Scheduled' | 'Interview Completed' | 'Selected' | 'Hired' | 'Rejected';

export interface IJobApplication extends Document {
  jobId: ICareerJob['_id'];
  fullName: string;
  email: string;
  phoneNumber: string;
  linkedinUrl?: string;
  currentLocation?: string;
  totalExperience?: string;
  currentCompany?: string;
  currentDesignation?: string;
  expectedSalary?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  coverLetter?: string;
  applicationStatus: ApplicationStatus;
  recruiterNotes?: string;
  lastEmailSent?: string;
  lastEmailSentAt?: Date;
  activityTimeline?: Array<{
    action: string;
    date: Date;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Job ID is required'],
      ref: 'CareerJob',
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [200, 'Full name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    linkedinUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'LinkedIn URL cannot exceed 500 characters'],
    },
    currentLocation: {
      type: String,
      trim: true,
      maxlength: [100, 'Current location cannot exceed 100 characters'],
    },
    totalExperience: {
      type: String,
      trim: true,
      maxlength: [100, 'Total experience cannot exceed 100 characters'],
    },
    currentCompany: {
      type: String,
      trim: true,
      maxlength: [200, 'Current company cannot exceed 200 characters'],
    },
    currentDesignation: {
      type: String,
      trim: true,
      maxlength: [200, 'Current designation cannot exceed 200 characters'],
    },
    expectedSalary: {
      type: String,
      trim: true,
      maxlength: [100, 'Expected salary cannot exceed 100 characters'],
    },
    resumeUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Resume URL cannot exceed 500 characters'],
    },
    resumePublicId: {
      type: String,
      trim: true,
      maxlength: [500, 'Resume Public ID cannot exceed 500 characters'],
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [5000, 'Cover letter cannot exceed 5000 characters'],
    },
    applicationStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired', 'Rejected'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Pending',
    },
    recruiterNotes: {
      type: String,
      trim: true,
      maxlength: [5000, 'Recruiter notes cannot exceed 5000 characters'],
    },
    lastEmailSent: {
      type: String,
      trim: true,
      maxlength: [100, 'Last email sent type cannot exceed 100 characters'],
    },
    lastEmailSentAt: {
      type: Date,
    },
    activityTimeline: {
      type: [{
        action: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        notes: {
          type: String,
        },
      }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering applications by job
JobApplicationSchema.index({ jobId: 1, createdAt: -1 });

// Index for filtering by status
JobApplicationSchema.index({ applicationStatus: 1, createdAt: -1 });

// Index for filtering by email (to prevent duplicate applications)
JobApplicationSchema.index({ email: 1, jobId: 1 }, { unique: true });

// Index for search
JobApplicationSchema.index({ fullName: 'text', email: 'text', currentCompany: 'text' });

// Prevent model overwrite during hot reload in development
const JobApplication: Model<IJobApplication> = mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

export default JobApplication;
