import mongoose, { Schema, Model, Document } from 'mongoose';

export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Index for status filtering
LeadSchema.index({ status: 1, createdAt: -1 });

// Prevent model overwrite during hot reload in development
const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
