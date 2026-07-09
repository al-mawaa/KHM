import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerGeneralInfo from '@/lib/models/CareerGeneralInfo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    if (req.method === 'GET') {
      const { sectionId, active } = req.query;
      
      let query: any = {};
      if (sectionId) {
        query.sectionId = sectionId;
      }
      if (active === 'true') {
        query.isActive = true;
      }

      const generalInfo = await CareerGeneralInfo.find(query).sort({ displayOrder: 1 });
      
      return res.status(200).json({
        success: true,
        data: generalInfo,
      });
    }

    if (req.method === 'POST') {
      const { sectionId, heading, content, images, videoUrl, ctaButton, ctaLink, displayOrder, isActive } = req.body;

      if (!sectionId || !heading || !content) {
        return res.status(400).json({
          success: false,
          message: 'Section ID, heading, and content are required',
        });
      }

      const info = await CareerGeneralInfo.create({
        sectionId,
        heading,
        content,
        images: images || [],
        videoUrl,
        ctaButton,
        ctaLink,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        data: info,
      });
    }

    if (req.method === 'PUT') {
      const { generalInfos } = req.body;

      if (!Array.isArray(generalInfos)) {
        return res.status(400).json({
          success: false,
          message: 'General info array is required',
        });
      }

      const updatePromises = generalInfos.map((info: any) =>
        CareerGeneralInfo.findByIdAndUpdate(
          info._id,
          { displayOrder: info.displayOrder },
          { new: true }
        )
      );

      const updatedInfos = await Promise.all(updatePromises);

      return res.status(200).json({
        success: true,
        data: updatedInfos,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career general info API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
