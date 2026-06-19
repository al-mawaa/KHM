import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import JobEnquiry from '@/lib/models/JobEnquiry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const { status } = req.query;
      const filter: Record<string, unknown> = {};
      if (status && status !== 'all') filter.status = status;

      const enquiries = await JobEnquiry.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: enquiries });
    }

    if (req.method === 'POST') {
      const {
        fullName,
        email,
        phoneNumber,
        departmentInterested,
        totalExperience,
        currentLocation,
        message,
        resumeUrl,
        resumePublicId,
      } = req.body;

      if (!fullName?.trim()) {
        return res.status(400).json({ success: false, message: 'Full name is required' });
      }
      if (!email?.trim()) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      if (!phoneNumber?.trim()) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }
      if (!departmentInterested?.trim()) {
        return res.status(400).json({ success: false, message: 'Department or role is required' });
      }
      if (!message?.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      const enquiry = await JobEnquiry.create({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        departmentInterested: departmentInterested.trim(),
        totalExperience: totalExperience?.trim(),
        currentLocation: currentLocation?.trim(),
        message: message.trim(),
        resumeUrl,
        resumePublicId,
        status: 'new',
      });

      return res.status(201).json({
        success: true,
        message: 'Job enquiry submitted successfully',
        data: enquiry,
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Job enquiries API error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
