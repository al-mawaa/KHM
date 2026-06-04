import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Project, { IProject } from '@/lib/models/Project';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/projects`);
    
    if (req.method === 'GET') {
      console.log('Fetching all projects...');
      const projects = await Project.find({}).sort({ createdAt: -1 });
      console.log(`Found ${projects.length} projects`);
      return res.status(200).json({ success: true, data: projects });
    }

    if (req.method === 'POST') {
      console.log('Creating project with body:', req.body);
      const { title, category, location, description, department, state, scope, status, type, image } = req.body;

      if (!title || !category || !location || !description || !department || !state || !scope || !status || !type) {
        console.log('Validation failed: missing required fields');
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required' 
        });
      }

      const project = await Project.create({
        title,
        category,
        location,
        description,
        department,
        state,
        scope,
        status,
        type,
        image,
      });

      console.log('Project created successfully:', project);
      return res.status(201).json({ success: true, data: project });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
