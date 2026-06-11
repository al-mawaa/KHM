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
    console.log(`API ${req.method} /api/team`);

    if (req.method === 'GET') {
      const team = await TeamMember.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: team.map(formatTeamMember) });
    }

    if (req.method === 'POST') {
      const { name, role, bio, image, imagePublicId } = req.body;
      if (!name || !role) {
        return res.status(400).json({ success: false, message: 'Name and role are required' });
      }

      const member = await TeamMember.create({ name, role, bio, image, imagePublicId });
      return res.status(201).json({ success: true, data: formatTeamMember(member) });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
