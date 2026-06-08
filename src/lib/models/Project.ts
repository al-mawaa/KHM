import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: string;
  location: string;
  description: string;
  department: string;
  state: string;
  scope: string;
  status: string;
  type: string;
  image?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    scope: {
      type: String,
      required: [true, 'Scope is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      trim: true,
      enum: ['Active', 'Upcoming'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
