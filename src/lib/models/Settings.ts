import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISettings extends Document {
  companyName: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube?: string;
  heroTitle: string;
  heroSubtitle: string;
  footerNote: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      default: 'KHM Infra Innovations Private Limited',
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
      default: 'Sustainable waste water engineering',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      default: 'Office No. St-1B, Stilt Floor, Axis Business Centre, Near Marigold Banquets, Bhugaon – 412115, Maharashtra, India',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      default: 'khminfrainnovations@gmail.com',
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      default: '+91 9028716090, 9511785597',
    },
    facebook: {
      type: String,
      required: [true, 'Facebook URL is required'],
      trim: true,
      default: 'https://facebook.com',
    },
    linkedin: {
      type: String,
      required: [true, 'LinkedIn URL is required'],
      trim: true,
      default: 'https://linkedin.com',
    },
    twitter: {
      type: String,
      required: [true, 'Twitter URL is required'],
      trim: true,
      default: 'https://twitter.com',
    },
    instagram: {
      type: String,
      required: [true, 'Instagram URL is required'],
      trim: true,
      default: 'https://instagram.com',
    },
    youtube: {
      type: String,
      trim: true,
      default: 'https://youtube.com',
    },
    heroTitle: {
      type: String,
      required: [true, 'Hero title is required'],
      trim: true,
      default: 'Engineering Water for a Sustainable Tomorrow',
    },
    heroSubtitle: {
      type: String,
      required: [true, 'Hero subtitle is required'],
      trim: true,
      default: 'Turnkey waste water management for buildings, industry & smart cities.',
    },
    footerNote: {
      type: String,
      required: [true, 'Footer note is required'],
      trim: true,
      default: 'Engineered with care for a sustainable tomorrow.',
    },
    seoTitle: {
      type: String,
      required: [true, 'SEO title is required'],
      trim: true,
      default: 'KHM Infra Innovations | Waste Water Management',
    },
    seoDescription: {
      type: String,
      required: [true, 'SEO description is required'],
      trim: true,
      default: 'Advanced sewage and effluent treatment, water recycling, and smart water infrastructure.',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload in development
const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
