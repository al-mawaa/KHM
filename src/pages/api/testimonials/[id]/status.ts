import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Testimonial, { ITestimonial, TestimonialStatus } from '@/lib/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/testimonials/[id]/status`);

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const { status } = req.body;

      console.log(`Updating testimonial ${id} status to:`, status);

      // Validate testimonial ID
      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Valid testimonial ID is required'
        });
      }

      // Validate status
      if (!status || typeof status !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const validStatuses: TestimonialStatus[] = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status as TestimonialStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: pending, approved, rejected'
        });
      }

      // Find and update testimonial
      const testimonial = await Testimonial.findById(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Update status
      testimonial.status = status as TestimonialStatus;
      await testimonial.save();

      console.log('Testimonial status updated successfully:', testimonial);
      return res.status(200).json({
        success: true,
        message: `Testimonial status updated to ${status}`,
        data: testimonial
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
