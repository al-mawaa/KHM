import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Gallery, { IGallery } from '@/lib/models/Gallery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  try {
    console.log(`API ${req.method} /api/gallery/${id}`);
    
    if (req.method === 'GET') {
      console.log('Fetching gallery item by id:', id);
      const galleryItem = await Gallery.findById(id);
      
      if (!galleryItem) {
        console.log('Gallery item not found');
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
      }

      console.log('Gallery item found:', galleryItem);
      return res.status(200).json({ success: true, data: galleryItem });
    }

    if (req.method === 'PUT') {
      console.log('Updating gallery item:', id, 'with body:', req.body);
      const { title, imageUrl, description } = req.body;

      const galleryItem = await Gallery.findByIdAndUpdate(
        id,
        { title, imageUrl, description },
        { new: true, runValidators: true }
      );

      if (!galleryItem) {
        console.log('Gallery item not found for update');
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
      }

      console.log('Gallery item updated successfully:', galleryItem);
      return res.status(200).json({ success: true, data: galleryItem });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting gallery item:', id);
      const galleryItem = await Gallery.findByIdAndDelete(id);

      if (!galleryItem) {
        console.log('Gallery item not found for deletion');
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
      }

      console.log('Gallery item deleted successfully');
      return res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
