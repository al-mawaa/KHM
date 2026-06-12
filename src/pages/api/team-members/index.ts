import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/team-members`);

    if (req.method === 'GET') {
      // Public GET: return only Active members sorted by displayOrder
      const { all } = req.query;
      const query = all === 'true' ? {} : { status: 'Active' as const };
      const members = await TeamMember.find(query).sort({ displayOrder: 1, createdAt: -1 });
      console.log(`Found ${members.length} team members`);
      return res.status(200).json({ success: true, data: members });
    }

    if (req.method === 'POST') {
      const { fullName, designation, profileImage, profileImagePublicId, bio, linkedinUrl, email, displayOrder, status } = req.body;

      if (!fullName || !designation) {
        return res.status(400).json({ success: false, message: 'Full name and designation are required' });
      }

      const member = await TeamMember.create({
        fullName,
        designation,
        profileImage: profileImage || '',
        profileImagePublicId: profileImagePublicId || '',
        bio: bio || '',
        linkedinUrl: linkedinUrl || '',
        email: email || '',
        displayOrder: displayOrder ?? 0,
        status: status || 'Active',
      });

      console.log('Team member created:', member._id);
      return res.status(201).json({ success: true, data: member });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Team members API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
