import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerBenefit from '@/lib/models/CareerBenefit';

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

      const benefits = await CareerBenefit.find(query).sort({ displayOrder: 1 });
      
      return res.status(200).json({
        success: true,
        data: benefits,
      });
    }

    if (req.method === 'POST') {
      const { sectionId, iconUrl, iconPublicId, title, description, buttonText, buttonLink, displayOrder, isActive } = req.body;

      if (!sectionId || !title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Section ID, title, and description are required',
        });
      }

      const benefit = await CareerBenefit.create({
        sectionId,
        iconUrl,
        iconPublicId,
        title,
        description,
        buttonText,
        buttonLink,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        data: benefit,
      });
    }

    if (req.method === 'PUT') {
      const { benefits } = req.body;

      if (!Array.isArray(benefits)) {
        return res.status(400).json({
          success: false,
          message: 'Benefits array is required',
        });
      }

      const updatePromises = benefits.map((benefit: any) =>
        CareerBenefit.findByIdAndUpdate(
          benefit._id,
          { displayOrder: benefit.displayOrder },
          { new: true }
        )
      );

      const updatedBenefits = await Promise.all(updatePromises);

      return res.status(200).json({
        success: true,
        data: updatedBenefits,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career benefits API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
