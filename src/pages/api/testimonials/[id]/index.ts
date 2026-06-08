import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Testimonial, { ITestimonial } from '@/lib/models/Testimonial';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/testimonials/[id]`);

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid testimonial ID is required'
      });
    }

    if (req.method === 'PATCH') {
      console.log(`Updating testimonial ${id}`);
      const { isFeatured, companyName, designation, city, profileImage, profileImagePublicId } = req.body;

      const testimonial = await Testimonial.findById(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Update only provided fields
      if (typeof isFeatured === 'boolean') {
        testimonial.isFeatured = isFeatured;
      }
      if (companyName !== undefined) {
        testimonial.companyName = companyName;
      }
      if (designation !== undefined) {
        testimonial.designation = designation;
      }
      if (city !== undefined) {
        testimonial.city = city;
      }
      if (profileImage !== undefined) {
        testimonial.profileImage = profileImage;
      }
      if (profileImagePublicId !== undefined) {
        testimonial.profileImagePublicId = profileImagePublicId;
      }

      await testimonial.save();

      console.log('Testimonial updated successfully:', testimonial);
      return res.status(200).json({
        success: true,
        message: 'Testimonial updated successfully',
        data: testimonial
      });
    }

    if (req.method === 'DELETE') {
      console.log(`Deleting testimonial ${id}`);

      const testimonial = await Testimonial.findById(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Delete image from Cloudinary if publicId exists
      if (testimonial.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(testimonial.profileImagePublicId);
          console.log('Cloudinary image deleted:', testimonial.profileImagePublicId);
        } catch (error) {
          console.error('Failed to delete Cloudinary image:', error);
        }
      }

      await Testimonial.findByIdAndDelete(id);

      console.log('Testimonial deleted successfully:', testimonial);
      return res.status(200).json({
        success: true,
        message: 'Testimonial deleted successfully'
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID format'
      });
    }
    
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
