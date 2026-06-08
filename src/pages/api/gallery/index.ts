import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Gallery, { IGallery } from '@/lib/models/Gallery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/gallery`);
    
    if (req.method === 'GET') {
      console.log('Fetching all gallery items...');
      const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
      console.log(`Found ${galleryItems.length} gallery items`);
      return res.status(200).json({ success: true, data: galleryItems });
    }

    if (req.method === 'POST') {
      console.log('Creating gallery item with body:', req.body);
      const { title, imageUrl, description } = req.body;

      if (!title || !imageUrl) {
        console.log('Validation failed: missing required fields');
        return res.status(400).json({ 
          success: false, 
          message: 'Title and imageUrl are required' 
        });
      }

      const galleryItem = await Gallery.create({
        title,
        imageUrl,
        description,
      });

      console.log('Gallery item created successfully:', galleryItem);
      return res.status(201).json({ success: true, data: galleryItem });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
