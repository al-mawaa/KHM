import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import RecruitmentStep from '@/lib/models/RecruitmentStep';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step ID',
      });
    }

    if (req.method === 'GET') {
      const step = await RecruitmentStep.findById(id);

      if (!step) {
        return res.status(404).json({
          success: false,
          message: 'Step not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: step,
      });
    }

    if (req.method === 'PUT') {
      const { stepNumber, title, description, displayOrder, isActive } = req.body;

      const step = await RecruitmentStep.findByIdAndUpdate(
        id,
        { stepNumber, title, description, displayOrder, isActive },
        { new: true, runValidators: true }
      );

      if (!step) {
        return res.status(404).json({
          success: false,
          message: 'Step not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: step,
      });
    }

    if (req.method === 'DELETE') {
      const step = await RecruitmentStep.findByIdAndDelete(id);

      if (!step) {
        return res.status(404).json({
          success: false,
          message: 'Step not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Step deleted successfully',
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Recruitment step API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
