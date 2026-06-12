import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';
import { sendEmail } from '@/lib/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(`🚀 API ${req.method} /api/contact`);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    await connectDB();

    if (req.method === 'POST') {
      console.log('📧 Received contact form submission');
      const { name, email, phone, company, service, message } = req.body;

      // Validation
      if (!name || !email || !phone || !service || !message) {
        console.log('❌ Validation failed: Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, email, phone, service, message'
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('❌ Validation failed: Invalid email format');
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Create lead in MongoDB
      console.log('💾 Creating lead in MongoDB...');
      const lead = await Lead.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company?.trim() || '',
        service: service.trim(),
        message: message.trim(),
        status: 'new'
      });
      console.log('✅ Lead created successfully:', lead._id);

      // Send email notification
      console.log('📧 Sending email notification...');
      const adminEmail = process.env.ADMIN_EMAIL || 'khminfrainnovations@gmail.com';
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">KHM Infra Innovations</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9);">New Contact Form Submission</p>
          </div>
          <div style="padding: 40px 30px; background: white;">
            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">New Enquiry Received</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600; width: 150px;">Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Phone:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${phone}</td>
              </tr>
              ${company ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Company:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Service:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Message:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${message}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1f2937; font-size: 14px;">
                <strong>Lead ID:</strong> ${lead._id}<br>
                <strong>Submitted at:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0; font-weight: 600;">KHM Infra Innovations</p>
            <p style="margin: 5px 0 0 0;">Waste Water Management & Environmental Engineering</p>
          </div>
        </div>
      `;

      const emailSent = await sendEmail({
        to: adminEmail,
        subject: `New Contact Form Enquiry from ${name}`,
        html: emailHtml
      });

      if (emailSent) {
        console.log('✅ Email notification sent successfully');
      } else {
        console.warn('⚠️ Email notification failed, but lead was saved');
      }

      console.log('✅ Contact form submission processed successfully');
      return res.status(200).json({
        success: true,
        message: 'Contact form submitted successfully',
        leadId: lead._id,
        emailSent
      });
    }

    console.log(`❌ Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError') {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + error.message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
