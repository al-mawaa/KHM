import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
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
    console.log(`API ${req.method} /api/team-members/${id}`);

    if (req.method === 'GET') {
      const member = await TeamMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      return res.status(200).json({ success: true, data: member });
    }

    if (req.method === 'PUT') {
      const { fullName, designation, profileImage, profileImagePublicId, bio, linkedinUrl, email, displayOrder, status } = req.body;

      if (!fullName || !designation) {
        return res.status(400).json({ success: false, message: 'Full name and designation are required' });
      }

      const member = await TeamMember.findByIdAndUpdate(
        id,
        { fullName, designation, profileImage, profileImagePublicId, bio, linkedinUrl, email, displayOrder, status },
        { new: true, runValidators: true }
      );

      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }

      console.log('Team member updated:', member._id);
      return res.status(200).json({ success: true, data: member });
    }

    if (req.method === 'DELETE') {
      const member = await TeamMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }

      // Delete Cloudinary image if exists
      if (member.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(member.profileImagePublicId);
          console.log('Cloudinary profile image deleted:', member.profileImagePublicId);
        } catch (err) {
          console.error('Failed to delete Cloudinary image:', err);
        }
      }

      await TeamMember.findByIdAndDelete(id);
      console.log('Team member deleted:', id);
      return res.status(200).json({ success: true, message: 'Team member deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Team member [id] API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
