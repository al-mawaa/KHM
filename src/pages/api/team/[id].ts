import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import TeamMember, { ITeamMember } from '@/lib/models/TeamMember';

function formatTeamMember(member: ITeamMember) {
  return {
    id: member._id.toString(),
    name: member.name,
    role: member.role,
    bio: member.bio,
    image: member.image,
    imagePublicId: member.imagePublicId,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid team member ID' });
    }

    console.log(`API ${req.method} /api/team/${id}`);

    if (req.method === 'PUT') {
      const { name, role, bio, image, imagePublicId } = req.body;
      if (!name || !role) {
        return res.status(400).json({ success: false, message: 'Name and role are required' });
      }

      const member = await TeamMember.findByIdAndUpdate(
        id,
        { name, role, bio, image, imagePublicId },
        { new: true, runValidators: true }
      );

      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }

      return res.status(200).json({ success: true, data: formatTeamMember(member) });
    }

    if (req.method === 'DELETE') {
      const member = await TeamMember.findByIdAndDelete(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
