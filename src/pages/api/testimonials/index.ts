import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Testimonial, { ITestimonial } from '@/lib/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/testimonials`);

    if (req.method === 'GET') {
      console.log('Fetching testimonials...');
      
      const { status, search, sort, featured } = req.query;
      const filter: any = {};
      
      // Filter by status if provided
      if (status && typeof status === 'string') {
        filter.status = status;
      }
      
      // Filter by featured if provided
      if (featured === 'true') {
        filter.isFeatured = true;
      }
      
      // Search functionality
      if (search && typeof search === 'string') {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { industryType: { $regex: search, $options: 'i' } },
        ];
      }
      
      // Sorting
      let sortOptions: any = { createdAt: -1 }; // Default: newest first
      
      if (sort && typeof sort === 'string') {
        switch (sort) {
          case 'oldest':
            sortOptions = { createdAt: 1 };
            break;
          case 'highest_rating':
            sortOptions = { rating: -1, createdAt: -1 };
            break;
          case 'featured':
            sortOptions = { isFeatured: -1, createdAt: -1 };
            break;
          case 'newest':
          default:
            sortOptions = { createdAt: -1 };
            break;
        }
      }
      
      const testimonials = await Testimonial.find(filter)
        .sort(sortOptions);
      
      console.log(`Found ${testimonials.length} testimonials with filter:`, filter);
      return res.status(200).json({
        success: true,
        data: testimonials
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
