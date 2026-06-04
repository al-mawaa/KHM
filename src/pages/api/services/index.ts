import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Service, { IService } from '@/lib/models/Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/services`);
    
    if (req.method === 'GET') {
      console.log('Fetching all services...');
      const services = await Service.find({}).sort({ createdAt: -1 });
      console.log(`Found ${services.length} services`);
      return res.status(200).json({ success: true, data: services });
    }

    if (req.method === 'POST') {
      console.log('Creating service with body:', req.body);
      const { title, slug, description, icon, category, points, image } = req.body;

      if (!title || !slug || !description || !category) {
        console.log('Validation failed: missing required fields');
        return res.status(400).json({ 
          success: false, 
          message: 'Title, slug, description, and category are required' 
        });
      }

      const service = await Service.create({
        title,
        slug,
        description,
        icon: icon || 'Droplets',
        category,
        points: points || [],
        image,
      });

      console.log('Service created successfully:', service);
      return res.status(201).json({ success: true, data: service });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
