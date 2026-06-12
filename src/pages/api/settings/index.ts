import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Settings, { ISettings } from '@/lib/models/Settings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(`🚀 API ${req.method} /api/settings`);
    console.log('📋 Request headers:', JSON.stringify(req.headers, null, 2));
    
    await connectDB();

    if (req.method === 'GET') {
      console.log('📖 Fetching website settings...');
      
      // Disable caching for this endpoint to always get fresh data
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('ETag', Date.now().toString()); // Dynamic ETag to prevent caching
      
      console.log('🔒 Cache headers set: no-store, no-cache, must-revalidate, private');
      
      // Get the first settings document (there should only be one)
      console.log('🔍 Querying database for settings...');
      let settings = await Settings.findOne();
      
      // If no settings exist, create default settings
      if (!settings) {
        console.log('⚠️ No settings found, creating defaults...');
        settings = await Settings.create({});
        console.log('✅ Default settings created:', settings._id);
      } else {
        console.log('✅ Settings found in database:', settings._id);
        console.log('📊 Settings data:', JSON.stringify(settings, null, 2));
      }
      
      console.log('📤 Sending response with status 200');
      const responseData = {
        success: true,
        data: settings,
      };
      console.log('📦 Response payload:', JSON.stringify(responseData, null, 2));
      
      return res.status(200).json(responseData);
    }

    if (req.method === 'PUT') {
      console.log('✏️ Updating website settings with body:', req.body);
      
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
        console.log('❌ Validation failed: Company name is required');
        return res.status(400).json({ 
          success: false, 
          message: 'Company name is required' 
        });
      }

      if (!email) {
        console.log('❌ Validation failed: Email is required');
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required' 
        });
      }

      if (!phone) {
        console.log('❌ Validation failed: Phone is required');
        return res.status(400).json({ 
          success: false, 
          message: 'Phone is required' 
        });
      }

      // Find existing settings or create new
      console.log('🔍 Checking for existing settings...');
      let settings = await Settings.findOne();
      
      if (settings) {
        console.log('📝 Updating existing settings:', settings._id);
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
        console.log('➕ Creating new settings document');
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

      console.log('✅ Settings updated successfully:', settings?._id);
      return res.status(200).json({ success: true, data: settings });
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
