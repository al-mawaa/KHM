import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Testimonial, { ITestimonial } from '@/lib/models/Testimonial';

// Simple in-memory rate limiting store
const submissionStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS = 3; // Max 3 submissions per minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const submissions = submissionStore.get(identifier) || [];
  
  // Remove submissions outside the window
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissionStore.set(identifier, recentSubmissions);
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/testimonials/submit`);

    if (req.method === 'POST') {
      console.log('Submitting testimonial with body:', req.body);
      const { name, feedback, industryType, rating, companyName, designation, city, profileImage, profileImagePublicId } = req.body;

      // Rate limiting based on IP
      const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
      if (!checkRateLimit(ip)) {
        console.log('Rate limit exceeded for IP:', ip);
        return res.status(429).json({
          success: false,
          message: 'Too many submissions. Please try again later.'
        });
      }

      // Validation
      if (!name || typeof name !== 'string' || name.trim() === '') {
        console.log('Validation failed: missing or invalid name');
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      if (!feedback || typeof feedback !== 'string' || feedback.trim() === '') {
        console.log('Validation failed: missing or invalid feedback');
        return res.status(400).json({
          success: false,
          message: 'Feedback is required'
        });
      }

      if (!industryType || typeof industryType !== 'string' || industryType.trim() === '') {
        console.log('Validation failed: missing or invalid industryType');
        return res.status(400).json({
          success: false,
          message: 'Industry type is required'
        });
      }

      // Create testimonial with status automatically set to pending
      const testimonial = await Testimonial.create({
        name: name.trim(),
        feedback: feedback.trim(),
        industryType: industryType.trim(),
        rating: rating || 5,
        companyName: companyName?.trim(),
        designation: designation?.trim(),
        city: city?.trim(),
        profileImage: profileImage?.trim(),
        profileImagePublicId: profileImagePublicId?.trim(),
        status: 'pending', // Always pending for public submissions
        isFeatured: false, // Public cannot set featured
      });

      console.log('Testimonial submitted successfully:', testimonial);
      return res.status(201).json({
        success: true,
        message: 'Testimonial submitted successfully. It will be reviewed by the admin.',
        data: testimonial
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
