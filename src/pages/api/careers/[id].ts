import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import CareerJob, { ICareerJob } from '@/lib/models/CareerJob';

const normalizeTextItems = (input: any, maxLength = 500): string[] => {
  if (!input) return [];

  const items: string[] = [];

  const addChunked = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (trimmed.length <= maxLength) {
      items.push(trimmed);
      return;
    }

    let start = 0;
    while (start < trimmed.length) {
      items.push(trimmed.slice(start, start + maxLength));
      start += maxLength;
    }
  };

  if (Array.isArray(input)) {
    input.forEach((item) => {
      if (typeof item === 'string') {
        item.split('\n').map((line) => line.trim()).filter(Boolean).forEach(addChunked);
      }
    });
  } else if (typeof input === 'string') {
    input.split('\n').map((line) => line.trim()).filter(Boolean).forEach(addChunked);
  }

  return items;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }

    console.log(`API ${req.method} /api/careers/${id}`);

    if (req.method === 'GET') {
      console.log('Fetching career job by ID...');

      const job = await CareerJob.findById(id);

      if (!job) {
        return res.status(404).json({ success: false, message: 'Career job not found' });
      }

      console.log('Career job found:', job._id);
      return res.status(200).json({
        success: true,
        data: job,
      });
    }

    if (req.method === 'PUT') {
      console.log('Updating career job...');

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
      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ success: false, message: 'Title must be a non-empty string' });
      }

      if (department !== undefined && (typeof department !== 'string' || department.trim() === '')) {
        return res.status(400).json({ success: false, message: 'Department must be a non-empty string' });
      }

      if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
        return res.status(400).json({ success: false, message: 'Location must be a non-empty string' });
      }

      if (employmentType !== undefined) {
        if (typeof employmentType !== 'string') {
          return res.status(400).json({ success: false, message: 'Employment type must be a string' });
        }
        const validEmploymentTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
        if (!validEmploymentTypes.includes(employmentType)) {
          return res.status(400).json({ success: false, message: 'Invalid employment type' });
        }
      }

      if (status !== undefined) {
        if (typeof status !== 'string') {
          return res.status(400).json({ success: false, message: 'Status must be a string' });
        }
        const validStatuses = ['Open', 'Closed'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ success: false, message: 'Invalid status' });
        }
      }

      if (applicationDeadline !== undefined) {
        const deadlineDate = new Date(applicationDeadline);
        if (isNaN(deadlineDate.getTime())) {
          return res.status(400).json({ success: false, message: 'Invalid application deadline date' });
        }
        if (deadlineDate <= new Date()) {
          return res.status(400).json({ success: false, message: 'Application deadline must be in the future' });
        }
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (department !== undefined) updateData.department = department;
      if (location !== undefined) updateData.location = location;
      if (employmentType !== undefined) updateData.employmentType = employmentType;
      if (experienceRequired !== undefined) updateData.experienceRequired = experienceRequired;
      if (salaryRange !== undefined) updateData.salaryRange = salaryRange;
      if (description !== undefined) updateData.description = description;
      if (responsibilities !== undefined) updateData.responsibilities = normalizeTextItems(responsibilities);
      if (requirements !== undefined) updateData.requirements = normalizeTextItems(requirements);
      if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills.filter((skill) => typeof skill === 'string').map((skill) => skill.trim()).filter(Boolean) : [];
      if (numberOfOpenings !== undefined) updateData.numberOfOpenings = numberOfOpenings;
      if (applicationDeadline !== undefined) updateData.applicationDeadline = new Date(applicationDeadline);
      if (status !== undefined) updateData.status = status;

      const job = await CareerJob.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!job) {
        return res.status(404).json({ success: false, message: 'Career job not found' });
      }

      console.log('Career job updated successfully:', job._id);
      return res.status(200).json({
        success: true,
        message: 'Career job updated successfully',
        data: job,
      });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting career job...');

      const job = await CareerJob.findByIdAndDelete(id);

      if (!job) {
        return res.status(404).json({ success: false, message: 'Career job not found' });
      }

      console.log('Career job deleted successfully:', id);
      return res.status(200).json({
        success: true,
        message: 'Career job deleted successfully',
        data: job,
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
