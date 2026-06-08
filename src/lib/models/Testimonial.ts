import mongoose, { Schema, Model, Document } from 'mongoose';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface ITestimonial extends Document {
  name: string;
  feedback: string;
  industryType: string;
  rating?: number;
  status: TestimonialStatus;
  companyName?: string;
  designation?: string;
  city?: string;
  profileImage?: string;
  profileImagePublicId?: string;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    feedback: {
      type: String,
      required: [true, 'Feedback is required'],
      trim: true,
    },
    industryType: {
      type: String,
      required: [true, 'Industry type is required'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    companyName: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    profileImagePublicId: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for featured testimonials
TestimonialSchema.index({ isFeatured: 1, status: 1, createdAt: -1 });

// Index for search
TestimonialSchema.index({ name: 'text', companyName: 'text', industryType: 'text' });

// Prevent model overwrite during hot reload in development
const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
