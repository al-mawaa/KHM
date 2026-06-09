import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Email transporter configuration
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@khminfra.com',
  };

  if (!config.host || !config.user || !config.pass) {
    console.warn('SMTP configuration incomplete. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

// Send email function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping email send.');
      return false;
    }

    const config: EmailConfig = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'noreply@khminfra.com',
    };

    const info = await transporter.sendMail({
      from: config.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email template generator
export const generateEmailTemplate = (
  type: 'application_received' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'hired' | 'rejected',
  data: {
    candidateName: string;
    jobTitle?: string;
    applicationDate?: string;
    recruiterNotes?: string;
  }
): string => {
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      <p style="margin: 0; font-weight: 600;">KHM Infra Innovations</p>
      <p style="margin: 5px 0 0 0;">Waste Water Management & Environmental Engineering</p>
    </div>
  `;

  const header = `
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">KHM Infra Innovations</h1>
    </div>
  `;

  const bodyStart = `
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      ${header}
      <div style="padding: 40px 30px;">
  `;

  const bodyEnd = `
        ${footer}
      </div>
    </div>
  `;

  let content = '';

  switch (type) {
    case 'application_received':
      content = `
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">Application Received</h2>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Dear <strong>${data.candidateName}</strong>,
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Thank you for your interest in joining KHM Infra Innovations. We have successfully received your application for the position of <strong>${data.jobTitle || 'the role'}</strong>.
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          <strong>Application Date:</strong> ${data.applicationDate || new Date().toLocaleDateString()}
        </p>
        <p style="margin: 0 0 25px 0; color: #4b5563; line-height: 1.6;">
          Our HR team will review your application and get back to you soon. We appreciate your patience during this process.
        </p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1f2937; font-size: 14px;">
            <strong>Next Steps:</strong> Our team will review your qualifications and contact you if your profile matches our requirements.
          </p>
        </div>
      `;
      break;

    case 'shortlisted':
      content = `
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">Application Shortlisted</h2>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Dear <strong>${data.candidateName}</strong>,
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Congratulations! We are pleased to inform you that your application for the position of <strong>${data.jobTitle || 'the role'}</strong> has been shortlisted.
        </p>
        <p style="margin: 0 0 25px 0; color: #4b5563; line-height: 1.6;">
          Your qualifications and experience have impressed our team, and we would like to move forward with the next steps of our hiring process.
        </p>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46; font-size: 14px;">
            <strong>What's Next:</strong> Our HR team will contact you shortly to schedule an interview.
          </p>
        </div>
      `;
      break;

    case 'interview_scheduled':
      content = `
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">Interview Scheduled</h2>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Dear <strong>${data.candidateName}</strong>,
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          We are pleased to inform you that the interview process for your application to <strong>${data.jobTitle || 'the role'}</strong> has begun.
        </p>
        ${data.recruiterNotes ? `
        <div style="background: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">
            <strong>Note from Recruiter:</strong>
          </p>
          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
            ${data.recruiterNotes}
          </p>
        </div>
        ` : ''}
        <p style="margin: 0 0 25px 0; color: #4b5563; line-height: 1.6;">
          Our team will reach out to you with the interview schedule details. Please ensure you are available for the scheduled time.
        </p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>Preparation Tips:</strong> Review the job description and prepare to discuss your experience and skills relevant to the position.
          </p>
        </div>
      `;
      break;

    case 'selected':
      content = `
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">Congratulations - You Have Been Selected</h2>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Dear <strong>${data.candidateName}</strong>,
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Congratulations! We are delighted to inform you that you have been selected for the position of <strong>${data.jobTitle || 'the role'}</strong> at KHM Infra Innovations.
        </p>
        <p style="margin: 0 0 25px 0; color: #4b5563; line-height: 1.6;">
          Your performance during the interview process was impressive, and we believe you will be a valuable addition to our team.
        </p>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46; font-size: 14px;">
            <strong>Next Steps:</strong> Our HR team will contact you with the formal offer letter and onboarding details.
          </p>
        </div>
      `;
      break;

    case 'hired':
      content = `
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">Welcome to KHM Infra Innovations</h2>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Dear <strong>${data.candidateName}</strong>,
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Welcome aboard! We are thrilled to have you join KHM Infra Innovations as our new <strong>${data.jobTitle || 'team member'}</strong>.
        </p>
        <p style="margin: 0 0 25px 0; color: #4b5563; line-height: 1.6;">
          The onboarding process will begin soon. You will receive detailed information about your start date, orientation schedule, and necessary documentation.
        </p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>What to Expect:</strong> Our HR team will guide you through the onboarding process and ensure a smooth transition into your new role.
          </p>
        </div>
      `;
      break;

    case 'rejected':
      content = `
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">Application Update</h2>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Dear <strong>${data.candidateName}</strong>,
        </p>
        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
          Thank you for your interest in the position of <strong>${data.jobTitle || 'the role'}</strong> at KHM Infra Innovations.
        </p>
        <p style="margin: 0 0 25px 0; color: #4b5563; line-height: 1.6;">
          After careful consideration of your application, we regret to inform you that we have decided to move forward with other candidates whose qualifications better match our current requirements.
        </p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>Note:</strong> We appreciate the time you invested in applying to our company. We encourage you to apply for future openings that match your skills and experience.
          </p>
        </div>
      `;
      break;

    default:
      content = '';
  }

  return bodyStart + content + bodyEnd;
};
