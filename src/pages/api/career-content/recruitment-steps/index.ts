import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import RecruitmentStep from '@/lib/models/RecruitmentStep';

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

      const steps = await RecruitmentStep.find(query).sort({ displayOrder: 1 });
      
      return res.status(200).json({
        success: true,
        data: steps,
      });
    }

    if (req.method === 'POST') {
      const { sectionId, stepNumber, title, description, displayOrder, isActive } = req.body;

      if (!sectionId || !stepNumber || !description) {
        return res.status(400).json({
          success: false,
          message: 'Section ID, step number, and description are required',
        });
      }

      const step = await RecruitmentStep.create({
        sectionId,
        stepNumber,
        title: title || `Step ${stepNumber}`,
        description,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        data: step,
      });
    }

    if (req.method === 'PUT') {
      const { steps } = req.body;

      if (!Array.isArray(steps)) {
        return res.status(400).json({
          success: false,
          message: 'Steps array is required',
        });
      }

      const updatePromises = steps.map((step: any) =>
        RecruitmentStep.findByIdAndUpdate(
          step._id,
          { displayOrder: step.displayOrder },
          { new: true }
        )
      );

      const updatedSteps = await Promise.all(updatePromises);

      return res.status(200).json({
        success: true,
        data: updatedSteps,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Recruitment steps API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
