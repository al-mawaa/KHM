import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerFAQ from '@/lib/models/CareerFAQ';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    if (req.method === 'GET') {
      const { sectionId, active, search } = req.query;
      
      let query: any = {};
      if (sectionId) {
        query.sectionId = sectionId;
      }
      if (active === 'true') {
        query.isActive = true;
      }
      if (search) {
        query.$or = [
          { question: { $regex: search, $options: 'i' } },
          { answer: { $regex: search, $options: 'i' } },
        ];
      }

      const faqs = await CareerFAQ.find(query).sort({ displayOrder: 1 });
      
      return res.status(200).json({
        success: true,
        data: faqs,
      });
    }

    if (req.method === 'POST') {
      const { sectionId, question, answer, displayOrder, isActive } = req.body;

      if (!sectionId || !question || !answer) {
        return res.status(400).json({
          success: false,
          message: 'Section ID, question, and answer are required',
        });
      }

      const faq = await CareerFAQ.create({
        sectionId,
        question,
        answer,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        data: faq,
      });
    }

    if (req.method === 'PUT') {
      const { faqs } = req.body;

      if (!Array.isArray(faqs)) {
        return res.status(400).json({
          success: false,
          message: 'FAQs array is required',
        });
      }

      const updatePromises = faqs.map((faq: any) =>
        CareerFAQ.findByIdAndUpdate(
          faq._id,
          { displayOrder: faq.displayOrder },
          { new: true }
        )
      );

      const updatedFAQs = await Promise.all(updatePromises);

      return res.status(200).json({
        success: true,
        data: updatedFAQs,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career FAQs API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
