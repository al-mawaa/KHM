import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Project, { IProject } from '@/lib/models/Project';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  try {
    console.log(`API ${req.method} /api/projects/${id}`);
    
    if (req.method === 'GET') {
      console.log('Fetching project by id:', id);
      const project = await Project.findById(id);
      
      if (!project) {
        console.log('Project not found');
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      console.log('Project found:', project);
      return res.status(200).json({ success: true, data: project });
    }

    if (req.method === 'PUT') {
      console.log('Updating project:', id, 'with body:', req.body);
      const { title, category, location, description, department, state, scope, status, type, image, imagePublicId } = req.body;

      const project = await Project.findByIdAndUpdate(
        id,
        { title, category, location, description, department, state, scope, status, type, image, imagePublicId },
        { new: true, runValidators: true }
      );

      if (!project) {
        console.log('Project not found for update');
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      console.log('Project updated successfully:', project);
      return res.status(200).json({ success: true, data: project });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting project:', id);
      const project = await Project.findById(id);

      if (!project) {
        console.log('Project not found for deletion');
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Delete image from Cloudinary if publicId exists
      if (project.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(project.imagePublicId);
          console.log('Cloudinary image deleted:', project.imagePublicId);
        } catch (error) {
          console.error('Failed to delete Cloudinary image:', error);
        }
      }

      await Project.findByIdAndDelete(id);

      console.log('Project deleted successfully');
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
