import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/testimonials/analytics`);

    if (req.method === 'GET') {
      console.log('Fetching testimonial analytics...');

      const total = await Testimonial.countDocuments();
      const pending = await Testimonial.countDocuments({ status: 'pending' });
      const approved = await Testimonial.countDocuments({ status: 'approved' });
      const rejected = await Testimonial.countDocuments({ status: 'rejected' });
      const featured = await Testimonial.countDocuments({ isFeatured: true, status: 'approved' });

      // Calculate average rating for approved testimonials
      const approvedTestimonials = await Testimonial.find({ status: 'approved' });
      const totalRating = approvedTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
      const averageRating = approvedTestimonials.length > 0 
        ? (totalRating / approvedTestimonials.length).toFixed(1) 
        : '0.0';

      // Calculate approval rate
      const approvalRate = total > 0 
        ? ((approved / total) * 100).toFixed(1) 
        : '0.0';

      // Calculate rejection rate
      const rejectionRate = total > 0 
        ? ((rejected / total) * 100).toFixed(1) 
        : '0.0';

      const analytics = {
        total,
        pending,
        approved,
        rejected,
        featured,
        averageRating: parseFloat(averageRating),
        approvalRate: parseFloat(approvalRate),
        rejectionRate: parseFloat(rejectionRate),
      };

      console.log('Analytics data:', analytics);
      return res.status(200).json({
        success: true,
        data: analytics
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
