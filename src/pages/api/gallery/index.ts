import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Gallery, { IGallery } from '@/lib/models/Gallery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/gallery`);
    
    if (req.method === 'GET') {
      console.log('Fetching all gallery items...');
      const gallery = await Gallery.find({}).sort({ createdAt: -1 });
      console.log(`Found ${gallery.length} gallery items`);
      
      if (!gallery || gallery.length === 0) {
        console.log('No gallery items found in database');
        return res.status(200).json([]);
      }
      
      return res.status(200).json(gallery);
    }

    if (req.method === 'POST') {
      console.log('Creating gallery item with body:', req.body);
      const { title, category, image, albumName, description } = req.body;

      if (!title || !category || !image || !albumName) {
        console.log('Validation failed: missing required fields');
        return res.status(400).json({ 
          success: false, 
          message: 'Title, category, image, and album name are required' 
        });
      }

      try {
        const galleryItem = await Gallery.create({
          title,
          category,
          image,
          albumName,
          description,
        });

        console.log('Gallery item created successfully:', galleryItem);
        return res.status(201).json(galleryItem);
      } catch (createError: any) {
        console.error('Error creating gallery item:', createError);
        return res.status(500).json({ 
          success: false, 
          message: createError.message || 'Failed to create gallery item' 
        });
      }
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
