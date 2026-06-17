import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Service, { IService } from '@/lib/models/Service';
import { v2 as cloudinary } from 'cloudinary';
import redis from '@/lib/redis';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
      const { title, slug, description, icon, category, points, image, imagePublicId } = req.body;

      const service = await Service.findByIdAndUpdate(
        id,
        { title, slug, description, icon, category, points, image, imagePublicId },
        { new: true, runValidators: true }
      );

      if (!service) {
        console.log('Service not found for update');
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      console.log('Service updated successfully:', service);
      
      // Invalidate cache
      if (redis) {
        try {
          await redis.del('services:all')
          console.log('Services cache invalidated')
        } catch (cacheError) {
          console.error('Redis cache invalidation error:', cacheError)
        }
      }
      
      return res.status(200).json({ success: true, data: service });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting service:', id);
      const service = await Service.findById(id);

      if (!service) {
        console.log('Service not found for deletion');
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      // Delete image from Cloudinary if publicId exists
      if (service.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(service.imagePublicId);
          console.log('Cloudinary image deleted:', service.imagePublicId);
        } catch (error) {
          console.error('Failed to delete Cloudinary image:', error);
        }
      }

      await Service.findByIdAndDelete(id);

      console.log('Service deleted successfully');
      
      // Invalidate cache
      if (redis) {
        try {
          await redis.del('services:all')
          console.log('Services cache invalidated')
        } catch (cacheError) {
          console.error('Redis cache invalidation error:', cacheError)
        }
      }
      
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
