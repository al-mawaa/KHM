import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITeamMember extends Document {
  // New fields for hierarchy
  name: string;
  designation: string;
  role: "director" | "subdirector" | "employee";
  department?: string;
  image?: string;
  imagePublicId?: string;
  order: number;
  isActive: boolean;

  // Legacy fields (retained for backward compatibility with existing files)
  fullName?: string;
  profileImage?: string;
  profileImagePublicId?: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
  displayOrder?: number;
  status?: "Active" | "Inactive";

  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    // New fields
    name: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["director", "subdirector", "employee"],
      trim: true,
    },
    department: {
      type: String,
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
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Legacy fields
    fullName: {
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
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent model overwrite during hot reload in development
const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
