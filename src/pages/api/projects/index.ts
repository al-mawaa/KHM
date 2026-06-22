import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Project, { IProject } from '@/lib/models/Project';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(`🚀 API ${req.method} /api/projects`);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    await connectDB();

    if (req.method === 'GET') {
      console.log('📖 Fetching all projects...');
      const projects = await Project.find({}).sort({ createdAt: -1 });
      console.log(`✅ Found ${projects.length} projects`);
      return res.status(200).json({ success: true, data: projects });
    }

    if (req.method === 'POST') {
      console.log('➕ Creating project with body:', req.body);
      const { title, category, location, description, department, state, scope, status, type, image } = req.body;

      if (!title?.trim() || !category?.trim() || !location?.trim() || !state?.trim() || !status?.trim()) {
        console.log('❌ Validation failed: missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Title, category, location, state, and status are required',
        });
      }

      const project = await Project.create({
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description?.trim() || '',
        department: department?.trim() || '',
        state: state.trim(),
        scope: scope?.trim() || '',
        status: status.trim(),
        type: type?.trim() || '',
        image,
      });

      console.log('✅ Project created successfully:', project._id);
      return res.status(201).json({ success: true, data: project });
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
