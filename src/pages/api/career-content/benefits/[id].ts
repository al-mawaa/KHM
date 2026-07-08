import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerBenefit from '@/lib/models/CareerBenefit';

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
        message: 'Invalid benefit ID',
      });
    }

    if (req.method === 'GET') {
      const benefit = await CareerBenefit.findById(id);

      if (!benefit) {
        return res.status(404).json({
          success: false,
          message: 'Benefit not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: benefit,
      });
    }

    if (req.method === 'PUT') {
      const { iconUrl, iconPublicId, title, description, buttonText, buttonLink, displayOrder, isActive } = req.body;

      const benefit = await CareerBenefit.findByIdAndUpdate(
        id,
        { iconUrl, iconPublicId, title, description, buttonText, buttonLink, displayOrder, isActive },
        { new: true, runValidators: true }
      );

      if (!benefit) {
        return res.status(404).json({
          success: false,
          message: 'Benefit not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: benefit,
      });
    }

    if (req.method === 'DELETE') {
      const benefit = await CareerBenefit.findByIdAndDelete(id);

      if (!benefit) {
        return res.status(404).json({
          success: false,
          message: 'Benefit not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Benefit deleted successfully',
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career benefit API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
