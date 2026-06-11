import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITeamMember extends Document {
  fullName: string;
  designation: string;
  profileImage?: string;
  profileImagePublicId?: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
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
    bio: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
