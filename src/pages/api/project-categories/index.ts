import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import ProjectCategory from '@/lib/models/ProjectCategory';

const DEFAULT_CATEGORIES = ['Government', 'Residential', 'Industrial', 'Commercial'];

async function ensureDefaultCategories() {
  const count = await ProjectCategory.countDocuments();
  if (count === 0) {
    await ProjectCategory.insertMany(
      DEFAULT_CATEGORIES.map((name, index) => ({ name, order: index }))
    );
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      await ensureDefaultCategories();
      const categories = await ProjectCategory.find({}).sort({ order: 1, name: 1 });
      return res.status(200).json({ success: true, data: categories });
    }

    if (req.method === 'POST') {
      const { name, order } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }

      const existing = await ProjectCategory.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }

      const category = await ProjectCategory.create({
        name: name.trim(),
        order: typeof order === 'number' ? order : 0,
      });

      return res.status(201).json({ success: true, data: category });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Project categories API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}
