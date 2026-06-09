import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Service, { IService } from '@/lib/models/Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { slug } = req.query;

  try {
    console.log(`API ${req.method} /api/services/slug/${slug}`);
    
    if (req.method === 'GET') {
      console.log('Fetching service by slug:', slug);
      const service = await Service.findOne({ slug: slug as string });
      
      if (!service) {
        console.log('Service not found');
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      console.log('Service found:', service);
      return res.status(200).json({ success: true, data: service });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
