import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Service, { IService } from '@/lib/models/Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  try {
    console.log(`API ${req.method} /api/services/${id}`);
    
    if (req.method === 'GET') {
      console.log('Fetching service by id:', id);
      const service = await Service.findById(id);
      
      if (!service) {
        console.log('Service not found');
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      console.log('Service found:', service);
      return res.status(200).json({ success: true, data: service });
    }

    if (req.method === 'PUT') {
      console.log('Updating service:', id, 'with body:', req.body);
      const { title, slug, description, icon, category, points, image } = req.body;

      const service = await Service.findByIdAndUpdate(
        id,
        { title, slug, description, icon, category, points, image },
        { new: true, runValidators: true }
      );

      if (!service) {
        console.log('Service not found for update');
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      console.log('Service updated successfully:', service);
      return res.status(200).json({ success: true, data: service });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting service:', id);
      const service = await Service.findByIdAndDelete(id);

      if (!service) {
        console.log('Service not found for deletion');
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      console.log('Service deleted successfully');
      return res.status(200).json({ success: true, message: 'Service deleted successfully' });
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
