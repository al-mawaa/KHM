import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import JobApplication, { IJobApplication } from '@/lib/models/JobApplication';
import { sendEmail, generateEmailTemplate } from '@/lib/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid application ID' });
    }

    console.log(`API ${req.method} /api/careers/applications/${id}`);

    if (req.method === 'GET') {
      console.log('Fetching job application by ID...');

      const application = await JobApplication.findById(id).populate('jobId', 'title department location employmentType');

      if (!application) {
        return res.status(404).json({ success: false, message: 'Job application not found' });
      }

      console.log('Job application found:', application._id);
      return res.status(200).json({
        success: true,
        data: application,
      });
    }

    if (req.method === 'PUT') {
      console.log('Updating job application...');

      const {
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
        coverLetter,
        applicationStatus,
        recruiterNotes,
      } = req.body;

      // Validation
      if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim() === '')) {
        return res.status(400).json({ success: false, message: 'Full name must be a non-empty string' });
      }

      if (email !== undefined) {
        if (typeof email !== 'string' || email.trim() === '') {
          return res.status(400).json({ success: false, message: 'Email must be a non-empty string' });
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }
      }

      if (phoneNumber !== undefined && (typeof phoneNumber !== 'string' || phoneNumber.trim() === '')) {
        return res.status(400).json({ success: false, message: 'Phone number must be a non-empty string' });
      }

      if (applicationStatus !== undefined) {
        if (typeof applicationStatus !== 'string') {
          return res.status(400).json({ success: false, message: 'Application status must be a string' });
        }
        const validStatuses = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired', 'Rejected'];
        if (!validStatuses.includes(applicationStatus)) {
          return res.status(400).json({ success: false, message: 'Invalid application status' });
        }
      }

      const updateData: any = {};
      if (fullName !== undefined) updateData.fullName = fullName;
      if (email !== undefined) updateData.email = email;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
      if (currentLocation !== undefined) updateData.currentLocation = currentLocation;
      if (totalExperience !== undefined) updateData.totalExperience = totalExperience;
      if (currentCompany !== undefined) updateData.currentCompany = currentCompany;
      if (currentDesignation !== undefined) updateData.currentDesignation = currentDesignation;
      if (expectedSalary !== undefined) updateData.expectedSalary = expectedSalary;
      if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl;
      if (coverLetter !== undefined) updateData.coverLetter = coverLetter;
      if (applicationStatus !== undefined) updateData.applicationStatus = applicationStatus;
      if (recruiterNotes !== undefined) updateData.recruiterNotes = recruiterNotes;

      // Get previous application to check status change
      const previousApplication = await JobApplication.findById(id);
      const previousStatus = previousApplication?.applicationStatus;

      const application = await JobApplication.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('jobId', 'title department location employmentType');

      if (!application) {
        return res.status(404).json({ success: false, message: 'Job application not found' });
      }

      console.log('Job application updated successfully:', application._id);

      // Add status change to timeline
      if (applicationStatus && previousStatus && applicationStatus !== previousStatus) {
        const timelineEntry = {
          action: applicationStatus,
          date: new Date(),
          notes: `Status changed from ${previousStatus} to ${applicationStatus}`,
        };
        
        await JobApplication.findByIdAndUpdate(id, {
          $push: { activityTimeline: timelineEntry },
        });
      }

      // Send email based on status change
      if (applicationStatus && previousStatus && applicationStatus !== previousStatus) {
        try {
          let emailType: 'shortlisted' | 'interview_scheduled' | 'selected' | 'hired' | 'rejected' | null = null;
          let emailSubject = '';
          let emailData: any = {
            candidateName: application.fullName,
            jobTitle: (application.jobId as any)?.title,
            recruiterNotes: application.recruiterNotes,
          };

          // Determine email type based on status transition
          if (applicationStatus === 'Shortlisted' && previousStatus === 'Pending') {
            emailType = 'shortlisted';
            emailSubject = 'Application Shortlisted - KHM Infra Innovations';
          } else if (applicationStatus === 'Interview Scheduled' && previousStatus === 'Shortlisted') {
            emailType = 'interview_scheduled';
            emailSubject = 'Interview Scheduled - KHM Infra Innovations';
          } else if (applicationStatus === 'Selected' && previousStatus === 'Interview Completed') {
            emailType = 'selected';
            emailSubject = 'Congratulations - You Have Been Selected';
          } else if (applicationStatus === 'Hired' && previousStatus === 'Selected') {
            emailType = 'hired';
            emailSubject = 'Welcome to KHM Infra Innovations';
          } else if (applicationStatus === 'Rejected') {
            emailType = 'rejected';
            emailSubject = 'Application Update - KHM Infra Innovations';
          }

          if (emailType) {
            const emailHtml = generateEmailTemplate(emailType, emailData);
            const emailSent = await sendEmail({
              to: application.email,
              subject: emailSubject,
              html: emailHtml,
            });

            if (emailSent) {
              await JobApplication.findByIdAndUpdate(id, {
                lastEmailSent: emailType,
                lastEmailSentAt: new Date(),
              });
              console.log(`${emailType} email sent to:`, application.email);
            }
          }
        } catch (emailError) {
          console.error('Error sending status update email:', emailError);
          // Don't block the workflow if email fails
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Job application updated successfully',
        data: application,
      });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting job application...');

      const application = await JobApplication.findByIdAndDelete(id);

      if (!application) {
        return res.status(404).json({ success: false, message: 'Job application not found' });
      }

      console.log('Job application deleted successfully:', id);
      return res.status(200).json({
        success: true,
        message: 'Job application deleted successfully',
        data: application,
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
      return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate entry detected' });
    }

    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
