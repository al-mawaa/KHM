import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  bio: string;
  image?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TeamMemberData = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
};

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
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

const TeamMember: Model<ITeamMember> = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
