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
      return res.status(200).json(galleryItem);
    }

    if (req.method === 'PUT') {
      console.log('Updating gallery item:', id, 'with body:', req.body);
      const { title, category, image, albumName, description } = req.body;

      try {
        const galleryItem = await Gallery.findByIdAndUpdate(
          id,
          { title, category, image, albumName, description },
          { new: true, runValidators: true }
        );

        if (!galleryItem) {
          console.log('Gallery item not found for update');
          return res.status(404).json({ success: false, message: 'Gallery item not found' });
        }

        console.log('Gallery item updated successfully:', galleryItem);
        return res.status(200).json(galleryItem);
      } catch (updateError: any) {
        console.error('Error updating gallery item:', updateError);
        return res.status(500).json({ 
          success: false, 
          message: updateError.message || 'Failed to update gallery item' 
        });
      }
    }

    if (req.method === 'DELETE') {
      console.log('Deleting gallery item:', id);
      
      try {
        const galleryItem = await Gallery.findByIdAndDelete(id);

        if (!galleryItem) {
          console.log('Gallery item not found for deletion');
          return res.status(404).json({ success: false, message: 'Gallery item not found' });
        }

        console.log('Gallery item deleted successfully');
        return res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
      } catch (deleteError: any) {
        console.error('Error deleting gallery item:', deleteError);
        return res.status(500).json({ 
          success: false, 
          message: deleteError.message || 'Failed to delete gallery item' 
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
