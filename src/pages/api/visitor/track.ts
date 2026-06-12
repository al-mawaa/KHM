import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import WebsiteVisitor from '@/lib/models/WebsiteVisitor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Don't await DB connection for tracking to keep it lightweight
  // Use fire-and-forget approach for performance
  connectDB().catch(() => {});

  try {
    if (req.method === 'POST') {
      const { page, userAgent } = req.body;

      // Get IP address from request headers
      const ipAddress = req.headers['x-forwarded-for'] as string || 
                        req.headers['x-real-ip'] as string || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress || 
                        'unknown';

      if (!page) {
        return res.status(400).json({ success: false, message: 'Page is required' });
      }

      // Check if this IP has visited in the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Use non-blocking check - don't await for performance
      WebsiteVisitor.findOne({
        ipAddress,
        visitedAt: { $gte: twentyFourHoursAgo }
      }).then((existingVisit) => {
        if (existingVisit) {
          // Already visited within 24h, don't count again
          console.log('Visitor already tracked within 24h:', ipAddress);
        } else {
          // New visitor or 24h+ since last visit
          WebsiteVisitor.create({
            ipAddress,
            page,
            userAgent: userAgent || '',
            visitedAt: new Date(),
          }).then(() => {
            console.log('New visitor tracked:', ipAddress, page);
          }).catch((err) => {
            console.error('Error tracking visitor:', err);
          });
        }
      }).catch((err) => {
        console.error('Error checking existing visitor:', err);
      });

      // Return immediately without waiting for DB operations
      return res.status(200).json({ success: true, message: 'Visitor tracking initiated' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
