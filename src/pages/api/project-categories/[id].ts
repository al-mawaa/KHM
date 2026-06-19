import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import ProjectCategory from '@/lib/models/ProjectCategory';
import Project from '@/lib/models/Project';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'PUT') {
      const { name, order } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }

      const current = await ProjectCategory.findById(id);
      if (!current) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const duplicate = await ProjectCategory.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }

      const oldName = current.name;
      const category = await ProjectCategory.findByIdAndUpdate(
        id,
        { name: name.trim(), order: typeof order === 'number' ? order : current.order },
        { new: true, runValidators: true }
      );

      if (oldName !== name.trim()) {
        await Project.updateMany({ category: oldName }, { category: name.trim() });
      }

      return res.status(200).json({ success: true, data: category });
    }

    if (req.method === 'DELETE') {
      const category = await ProjectCategory.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const inUse = await Project.countDocuments({ category: category.name });
      if (inUse > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete: ${inUse} project(s) use this category`,
        });
      }

      await ProjectCategory.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Project category [id] API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
