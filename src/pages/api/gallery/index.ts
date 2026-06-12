import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Gallery, { IGallery } from '@/lib/models/Gallery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(`🚀 API ${req.method} /api/gallery`);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    await connectDB();

    if (req.method === 'GET') {
      console.log('📖 Fetching all gallery items...');
      const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
      console.log(`✅ Found ${galleryItems.length} gallery items`);
      return res.status(200).json({ success: true, data: galleryItems });
    }

    if (req.method === 'POST') {
      console.log('➕ Creating gallery item with body:', req.body);
      const { title, imageUrl, description } = req.body;

      if (!title || !imageUrl) {
        console.log('❌ Validation failed: missing required fields');
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

      console.log('✅ Gallery item created successfully:', galleryItem._id);
      return res.status(201).json({ success: true, data: galleryItem });
    }

    console.log(`❌ Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError') {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + error.message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
