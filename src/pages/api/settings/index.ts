import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Settings, { ISettings } from '@/lib/models/Settings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/settings`);
    
    if (req.method === 'GET') {
      console.log('Fetching website settings...');
      
      // Get the first settings document (there should only be one)
      let settings = await Settings.findOne();
      
      // If no settings exist, create default settings
      if (!settings) {
        console.log('No settings found, creating defaults...');
        settings = await Settings.create({});
        console.log('Default settings created:', settings);
      }
      
      console.log('Settings fetched successfully');
      return res.status(200).json({
        success: true,
        data: settings,
      });
    }

    if (req.method === 'PUT') {
      console.log('Updating website settings with body:', req.body);
      
      const {
        companyName,
        tagline,
        address,
        email,
        phone,
        facebook,
        linkedin,
        twitter,
        instagram,
        youtube,
        heroTitle,
        heroSubtitle,
        footerNote,
        seoTitle,
        seoDescription,
      } = req.body;

      // Validation
      if (!companyName) {
        return res.status(400).json({ 
          success: false, 
          message: 'Company name is required' 
        });
      }

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required' 
        });
      }

      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone is required' 
        });
      }

      // Find existing settings or create new
      let settings = await Settings.findOne();
      
      if (settings) {
        // Update existing settings
        settings = await Settings.findByIdAndUpdate(
          settings._id,
          {
            companyName,
            tagline,
            address,
            email,
            phone,
            facebook,
            linkedin,
            twitter,
            instagram,
            youtube,
            heroTitle,
            heroSubtitle,
            footerNote,
            seoTitle,
            seoDescription,
          },
          { new: true, runValidators: true }
        );
      } else {
        // Create new settings
        settings = await Settings.create({
          companyName,
          tagline,
          address,
          email,
          phone,
          facebook,
          linkedin,
          twitter,
          instagram,
          youtube,
          heroTitle,
          heroSubtitle,
          footerNote,
          seoTitle,
          seoDescription,
        });
      }

      console.log('Settings updated successfully:', settings);
      return res.status(200).json({ success: true, data: settings });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
