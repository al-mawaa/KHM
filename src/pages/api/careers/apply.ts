import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import JobApplication, { IJobApplication } from '@/lib/models/JobApplication';
import CareerJob from '@/lib/models/CareerJob';
import { sendEmail, generateEmailTemplate } from '@/lib/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/careers/apply`);

    if (req.method === 'POST') {
      console.log('Submitting job application...');

      const {
        jobId,
        fullName,
        email,
        phoneNumber,
        linkedinUrl,
        currentLocation,
        totalExperience,
        currentCompany,
        currentDesignation,
        expectedSalary,
        resumeUrl,
        resumePublicId,
        coverLetter,
        applicationStatus,
      } = req.body;

      // Validation
      if (!jobId || typeof jobId !== 'string') {
        return res.status(400).json({ success: false, message: 'Job ID is required and must be a string' });
      }

      if (!fullName || typeof fullName !== 'string') {
        return res.status(400).json({ success: false, message: 'Full name is required and must be a string' });
      }

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required and must be a string' });
      }

      // Email validation
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      }

      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({ success: false, message: 'Phone number is required and must be a string' });
      }

      // Check if the job exists and is open
      const job = await CareerJob.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      if (job.status !== 'Open') {
        return res.status(400).json({ success: false, message: 'This job is not accepting applications' });
      }

      // Check if application deadline has passed
      if (job.applicationDeadline && job.applicationDeadline < new Date()) {
        return res.status(400).json({ success: false, message: 'Application deadline for this job has passed' });
      }

      // Check if user has already applied for this job
      const existingApplication = await JobApplication.findOne({ jobId, email });
      if (existingApplication) {
        return res.status(409).json({ success: false, message: 'You have already applied for this job' });
      }

      // Validate application status if provided
      if (applicationStatus && typeof applicationStatus === 'string') {
        const validStatuses = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired', 'Rejected'];
        if (!validStatuses.includes(applicationStatus)) {
          return res.status(400).json({ success: false, message: 'Invalid application status' });
        }
      }

      const application = await JobApplication.create({
        jobId,
        fullName,
        email,
        phoneNumber,
        linkedinUrl,
        currentLocation,
        totalExperience,
        currentCompany,
        currentDesignation,
        expectedSalary,
        resumeUrl,
        resumePublicId,
        coverLetter,
        applicationStatus: applicationStatus || 'Pending',
        activityTimeline: [{
          action: 'Application Submitted',
          date: new Date(),
          notes: `Applied for position: ${job.title}`,
        }],
      });

      console.log('Job application submitted successfully:', application._id);

      // Send Application Received email
      try {
        const emailHtml = generateEmailTemplate('application_received', {
          candidateName: fullName,
          jobTitle: job.title,
          applicationDate: new Date().toLocaleDateString(),
        });

        const emailSent = await sendEmail({
          to: email,
          subject: 'Application Received - KHM Infra Innovations',
          html: emailHtml,
        });

        if (emailSent) {
          await JobApplication.findByIdAndUpdate(application._id, {
            lastEmailSent: 'application_received',
            lastEmailSentAt: new Date(),
          });
          console.log('Application received email sent to:', email);
        }
      } catch (emailError) {
        console.error('Error sending application received email:', emailError);
        // Don't block the workflow if email fails
      }

      return res.status(201).json({
        success: true,
        message: 'Job application submitted successfully',
        data: application,
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already applied for this job' });
    }

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
