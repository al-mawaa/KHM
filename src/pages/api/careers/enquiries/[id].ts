import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import JobEnquiry from '@/lib/models/JobEnquiry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
      const enquiry = await JobEnquiry.findById(id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
      return res.status(200).json({ success: true, data: enquiry });
    }

    if (req.method === 'PUT') {
      const { status, adminNotes } = req.body;
      const update: Record<string, unknown> = {};

      if (status) {
        if (!['new', 'reviewed', 'contacted', 'closed'].includes(status)) {
          return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        update.status = status;
      }
      if (adminNotes !== undefined) update.adminNotes = adminNotes;

      const enquiry = await JobEnquiry.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }

      return res.status(200).json({ success: true, data: enquiry });
    }

    if (req.method === 'DELETE') {
      const enquiry = await JobEnquiry.findByIdAndDelete(id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
      return res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Job enquiry [id] API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
