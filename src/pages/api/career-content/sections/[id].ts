import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerSection from '@/lib/models/CareerSection';

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
        message: 'Invalid section ID',
      });
    }

    if (req.method === 'GET') {
      const section = await CareerSection.findById(id);

      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: section,
      });
    }

    if (req.method === 'PUT') {
      const { title, description, displayOrder, isActive } = req.body;

      const section = await CareerSection.findByIdAndUpdate(
        id,
        { title, description, displayOrder, isActive },
        { new: true, runValidators: true }
      );

      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: section,
      });
    }

    if (req.method === 'DELETE') {
      const section = await CareerSection.findByIdAndDelete(id);

      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Section deleted successfully',
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career section API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
