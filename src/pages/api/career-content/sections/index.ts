import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerSection from '@/lib/models/CareerSection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    if (req.method === 'GET') {
      const { sectionType, active } = req.query;
      
      let query: any = {};
      if (sectionType) {
        query.sectionType = sectionType;
      }
      if (active === 'true') {
        query.isActive = true;
      }

      const sections = await CareerSection.find(query).sort({ displayOrder: 1 });
      
      return res.status(200).json({
        success: true,
        data: sections,
      });
    }

    if (req.method === 'POST') {
      const { sectionType, title, description, displayOrder, isActive } = req.body;

      if (!sectionType || !title) {
        return res.status(400).json({
          success: false,
          message: 'Section type and title are required',
        });
      }

      const section = await CareerSection.create({
        sectionType,
        title,
        description,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        data: section,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career sections API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
