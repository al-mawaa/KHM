import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import CareerJob, { ICareerJob } from '@/lib/models/CareerJob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/careers`);

    if (req.method === 'POST') {
      console.log('Creating new career job...');
      console.log('Request body:', req.body);

      const {
        title,
        department,
        location,
        employmentType,
        experienceRequired,
        salaryRange,
        description,
        responsibilities,
        requirements,
        skills,
        numberOfOpenings,
        applicationDeadline,
        status,
      } = req.body;

      // Validation
      if (!title || typeof title !== 'string') {
        console.error('Validation failed: Title is required');
        return res.status(400).json({ success: false, message: 'Title is required and must be a string' });
      }

      if (!department || typeof department !== 'string') {
        console.error('Validation failed: Department is required');
        return res.status(400).json({ success: false, message: 'Department is required and must be a string' });
      }

      if (!location || typeof location !== 'string') {
        console.error('Validation failed: Location is required');
        return res.status(400).json({ success: false, message: 'Location is required and must be a string' });
      }

      if (!employmentType || typeof employmentType !== 'string') {
        console.error('Validation failed: Employment type is required');
        return res.status(400).json({ success: false, message: 'Employment type is required and must be a string' });
      }

      const validEmploymentTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
      if (!validEmploymentTypes.includes(employmentType)) {
        console.error('Validation failed: Invalid employment type:', employmentType);
        return res.status(400).json({ success: false, message: 'Invalid employment type' });
      }

      if (status && typeof status === 'string') {
        const validStatuses = ['Open', 'Closed'];
        if (!validStatuses.includes(status)) {
          console.error('Validation failed: Invalid status:', status);
          return res.status(400).json({ success: false, message: 'Invalid status' });
        }
      }

      if (applicationDeadline) {
        const deadlineDate = new Date(applicationDeadline);
        if (isNaN(deadlineDate.getTime())) {
          console.error('Validation failed: Invalid application deadline date');
          return res.status(400).json({ success: false, message: 'Invalid application deadline date' });
        }
        if (deadlineDate <= new Date()) {
          console.error('Validation failed: Application deadline must be in the future');
          return res.status(400).json({ success: false, message: 'Application deadline must be in the future' });
        }
      }

      const job = await CareerJob.create({
        title,
        department,
        location,
        employmentType: employmentType as 'Full Time' | 'Part Time' | 'Contract' | 'Internship',
        experienceRequired,
        salaryRange,
        description,
        responsibilities: responsibilities || [],
        requirements: requirements || [],
        skills: skills || [],
        numberOfOpenings,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
        status: (status || 'Open') as 'Open' | 'Closed',
      });

      console.log('Career job created successfully:', (job as any)._id);
      return res.status(201).json({
        success: true,
        message: 'Career job created successfully',
        data: job,
      });
    }

    if (req.method === 'GET') {
      console.log('Fetching career jobs...');

      const { status, department, location, employmentType, search, sort } = req.query;
      const filter: any = {};

      // Filter by status if provided
      if (status && typeof status === 'string') {
        const validStatuses = ['Open', 'Closed'];
        if (validStatuses.includes(status)) {
          filter.status = status;
        }
      }

      // Filter by department if provided
      if (department && typeof department === 'string') {
        filter.department = { $regex: department, $options: 'i' };
      }

      // Filter by location if provided
      if (location && typeof location === 'string') {
        filter.location = { $regex: location, $options: 'i' };
      }

      // Filter by employment type if provided
      if (employmentType && typeof employmentType === 'string') {
        const validEmploymentTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
        if (validEmploymentTypes.includes(employmentType)) {
          filter.employmentType = employmentType;
        }
      }

      // Search functionality
      if (search && typeof search === 'string') {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { skills: { $regex: search, $options: 'i' } },
        ];
      }

      // Sorting
      let sortOptions: any = { createdAt: -1 }; // Default: newest first

      if (sort && typeof sort === 'string') {
        switch (sort) {
          case 'oldest':
            sortOptions = { createdAt: 1 };
            break;
          case 'deadline':
            sortOptions = { applicationDeadline: 1 };
            break;
          case 'newest':
          default:
            sortOptions = { createdAt: -1 };
            break;
        }
      }

      const jobs = await CareerJob.find(filter).sort(sortOptions);

      console.log(`Found ${jobs.length} career jobs with filter:`, filter);
      return res.status(200).json({
        success: true,
        data: jobs,
        count: jobs.length,
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate entry detected' });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
