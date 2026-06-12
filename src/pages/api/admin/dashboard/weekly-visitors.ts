import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import WebsiteVisitor from '@/lib/models/WebsiteVisitor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/admin/dashboard/weekly-visitors`);

    if (req.method === 'GET') {
      console.log('Fetching weekly visitors data...');

      // Get the last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6); // Go back 6 days to include today (7 days total)
      sevenDaysAgo.setHours(0, 0, 0, 0);

      // Aggregate visitors by day for the last 7 days
      const dailyVisitors = await WebsiteVisitor.aggregate([
        {
          $match: {
            visitedAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$visitedAt' },
              month: { $month: '$visitedAt' },
              day: { $dayOfMonth: '$visitedAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      console.log('Daily visitors aggregation result:', dailyVisitors);

      // Create a map of day counts
      const visitorMap = new Map<string, number>();
      dailyVisitors.forEach((item: any) => {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        visitorMap.set(dayName, item.count);
      });

      // Generate the last 7 days with proper day names
      const weeklyData = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = dayNames[date.getDay()];
        const count = visitorMap.get(dayName) || 0;
        weeklyData.push({ day: dayName, visitors: count });
      }

      console.log('Weekly visitors data:', weeklyData);

      return res.status(200).json({
        success: true,
        data: weeklyData,
      });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
