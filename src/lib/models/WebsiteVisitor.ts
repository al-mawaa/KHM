import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IWebsiteVisitor extends Document {
  ipAddress: string;
  visitedAt: Date;
  page: string;
  userAgent: string;
}

const WebsiteVisitorSchema = new Schema<IWebsiteVisitor>(
  {
    ipAddress: {
      type: String,
      required: [true, 'IP address is required'],
      trim: true,
    },
    visitedAt: {
      type: Date,
      required: [true, 'Visited date is required'],
      default: Date.now,
    },
    page: {
      type: String,
      required: [true, 'Page is required'],
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient duplicate checking (IP + 24h window)
WebsiteVisitorSchema.index({ ipAddress: 1, visitedAt: 1 });

// Index for page analytics
WebsiteVisitorSchema.index({ page: 1, visitedAt: -1 });

// Index for date-based queries
WebsiteVisitorSchema.index({ visitedAt: -1 });

// Prevent model overwrite during hot reload in development
const WebsiteVisitor: Model<IWebsiteVisitor> = mongoose.models.WebsiteVisitor || mongoose.model<IWebsiteVisitor>('WebsiteVisitor', WebsiteVisitorSchema);

export default WebsiteVisitor;
