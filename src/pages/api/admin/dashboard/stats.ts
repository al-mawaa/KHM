import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Service from '@/lib/models/Service';
import Blog from '@/lib/models/Blog';
import Testimonial from '@/lib/models/Testimonial';
import Lead from '@/lib/models/Lead';
import WebsiteVisitor from '@/lib/models/WebsiteVisitor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/admin/dashboard/stats`);

    if (req.method === 'GET') {
      console.log('Fetching dashboard stats...');

      // Fetch counts from all collections in parallel
      const [totalProjects, totalServices, totalLeads, totalBlogs, totalTestimonials, totalVisitors] = await Promise.all([
        Project.countDocuments({}),
        Service.countDocuments({}),
        Lead.countDocuments({}),
        Blog.countDocuments({}),
        Testimonial.countDocuments({}),
        WebsiteVisitor.countDocuments({}),
      ]);

      console.log('Dashboard stats fetched:', {
        totalProjects,
        totalServices,
        totalLeads,
        totalBlogs,
        totalTestimonials,
        totalVisitors,
      });

      return res.status(200).json({
        success: true,
        data: {
          totalProjects,
          totalServices,
          totalLeads,
          totalBlogs,
          totalTestimonials,
          totalVisitors,
        },
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
