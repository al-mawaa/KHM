import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import JobApplication, { IJobApplication } from '@/lib/models/JobApplication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/careers/applications`);

    if (req.method === 'GET') {
      console.log('Fetching job applications...');

      const { jobId, applicationStatus, search, sort } = req.query;
      const filter: any = {};

      // Filter by job ID if provided
      if (jobId && typeof jobId === 'string') {
        filter.jobId = jobId;
      }

      // Filter by application status if provided
      if (applicationStatus && typeof applicationStatus === 'string') {
        const validStatuses = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired', 'Rejected'];
        if (validStatuses.includes(applicationStatus)) {
          filter.applicationStatus = applicationStatus;
        }
      }

      // Search functionality - search by candidate name, email, phone, company, designation
      if (search && typeof search === 'string') {
        filter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { currentCompany: { $regex: search, $options: 'i' } },
          { currentDesignation: { $regex: search, $options: 'i' } },
        ];
      }

      // Sorting
      let sortOptions: any = { createdAt: -1 }; // Default: newest first

      if (sort && typeof sort === 'string') {
        switch (sort) {
          case 'oldest':
            sortOptions = { createdAt: 1 };
            break;
          case 'name':
            sortOptions = { fullName: 1 };
            break;
          case 'status':
            sortOptions = { applicationStatus: 1, createdAt: -1 };
            break;
          case 'newest':
          default:
            sortOptions = { createdAt: -1 };
            break;
        }
      }

      const applications = await JobApplication.find(filter)
        .populate('jobId', 'title department location employmentType')
        .sort(sortOptions);

      console.log(`Found ${applications.length} job applications with filter:`, filter);
      return res.status(200).json({
        success: true,
        data: applications,
        count: applications.length,
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
