import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerFAQ from '@/lib/models/CareerFAQ';

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
        message: 'Invalid FAQ ID',
      });
    }

    if (req.method === 'GET') {
      const faq = await CareerFAQ.findById(id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: faq,
      });
    }

    if (req.method === 'PUT') {
      const { question, answer, displayOrder, isActive } = req.body;

      const faq = await CareerFAQ.findByIdAndUpdate(
        id,
        { question, answer, displayOrder, isActive },
        { new: true, runValidators: true }
      );

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: faq,
      });
    }

    if (req.method === 'DELETE') {
      const faq = await CareerFAQ.findByIdAndDelete(id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'FAQ deleted successfully',
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career FAQ API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
