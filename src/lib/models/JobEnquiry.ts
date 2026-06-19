import mongoose, { Schema, Model, Document } from 'mongoose';

export type JobEnquiryStatus = 'new' | 'reviewed' | 'contacted' | 'closed';

export interface IJobEnquiry extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentInterested: string;
  totalExperience?: string;
  currentLocation?: string;
  message: string;
  resumeUrl?: string;
  resumePublicId?: string;
  status: JobEnquiryStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobEnquirySchema = new Schema<IJobEnquiry>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 200,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: 255,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: 20,
    },
    departmentInterested: {
      type: String,
      required: [true, 'Department or role is required'],
      trim: true,
      maxlength: 200,
    },
    totalExperience: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    currentLocation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 5000,
    },
    resumeUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    resumePublicId: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'contacted', 'closed'],
      default: 'new',
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  }
);

JobEnquirySchema.index({ status: 1, createdAt: -1 });
JobEnquirySchema.index({ email: 1, createdAt: -1 });

const JobEnquiry: Model<IJobEnquiry> =
  mongoose.models.JobEnquiry || mongoose.model<IJobEnquiry>('JobEnquiry', JobEnquirySchema);

export default JobEnquiry;
