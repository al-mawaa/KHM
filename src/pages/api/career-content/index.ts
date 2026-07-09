import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CareerSection from '@/lib/models/CareerSection';
import RecruitmentStep from '@/lib/models/RecruitmentStep';
import CareerFAQ from '@/lib/models/CareerFAQ';
import CareerBenefit from '@/lib/models/CareerBenefit';
import CareerGeneralInfo from '@/lib/models/CareerGeneralInfo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    if (req.method === 'GET') {
      // Fetch all active sections ordered by displayOrder
      const sections = await CareerSection.find({ isActive: true }).sort({ displayOrder: 1 });
      
      // Fetch content for each section type
      const [recruitmentSteps, faqs, benefits, generalInfos] = await Promise.all([
        RecruitmentStep.find({ isActive: true }).sort({ displayOrder: 1 }),
        CareerFAQ.find({ isActive: true }).sort({ displayOrder: 1 }),
        CareerBenefit.find({ isActive: true }).sort({ displayOrder: 1 }),
        CareerGeneralInfo.find({ isActive: true }).sort({ displayOrder: 1 }),
      ]);

      // Group content by section type
      const content = {
        sections: sections.map(section => ({
          _id: section._id,
          sectionType: section.sectionType,
          title: section.title,
          description: section.description,
          displayOrder: section.displayOrder,
        })),
        recruitmentProcess: {
          section: sections.find(s => s.sectionType === 'recruitment_process'),
          steps: recruitmentSteps,
        },
        faqs: {
          section: sections.find(s => s.sectionType === 'faq'),
          items: faqs,
        },
        benefits: {
          section: sections.find(s => s.sectionType === 'benefits'),
          items: benefits,
        },
        generalInfo: {
          section: sections.find(s => s.sectionType === 'general_info'),
          items: generalInfos,
        },
      };

      return res.status(200).json({
        success: true,
        data: content,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error: any) {
    console.error('Career content API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
