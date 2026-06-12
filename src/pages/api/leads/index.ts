import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    // ── GET /api/leads ─────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { status } = req.query;
      const filter: Record<string, unknown> = {};
      if (status && status !== 'all') filter.status = status;

      const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

      const mapped = leads.map((l: any) => ({
        id: l._id.toString(),
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company || '',
        service: l.service,
        message: l.message,
        status: l.status,
        createdAt: l.createdAt,
      }));

      return res.status(200).json({ success: true, data: mapped });
    }

    // ── PATCH /api/leads?id=xxx ────────────────────────────────────────────
    if (req.method === 'PATCH') {
      const { id } = req.query;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ success: false, message: 'id and status are required' });
      }
      if (!['new', 'contacted', 'closed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }

      const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true }).lean();
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

      return res.status(200).json({ success: true, data: lead });
    }

    // ── DELETE /api/leads?id=xxx ───────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, message: 'id is required' });

      const lead = await Lead.findByIdAndDelete(id);
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

      return res.status(200).json({ success: true, message: 'Lead deleted' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('❌ /api/leads error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
