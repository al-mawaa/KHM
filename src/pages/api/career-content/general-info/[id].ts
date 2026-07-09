import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerGeneralInfo from '@/lib/models/CareerGeneralInfo';

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
        message: 'Invalid general info ID',
      });
    }

    if (req.method === 'GET') {
      const info = await CareerGeneralInfo.findById(id);

      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'General info not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: info,
      });
    }

    if (req.method === 'PUT') {
      const { heading, content, images, videoUrl, ctaButton, ctaLink, displayOrder, isActive } = req.body;

      const info = await CareerGeneralInfo.findByIdAndUpdate(
        id,
        { heading, content, images, videoUrl, ctaButton, ctaLink, displayOrder, isActive },
        { new: true, runValidators: true }
      );

      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'General info not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: info,
      });
    }

    if (req.method === 'DELETE') {
      const info = await CareerGeneralInfo.findByIdAndDelete(id);

      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'General info not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'General info deleted successfully',
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
