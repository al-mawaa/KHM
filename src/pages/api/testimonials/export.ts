import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/testimonials/export`);

    if (req.method === 'GET') {
      console.log('Exporting testimonials to CSV...');

      const testimonials = await Testimonial.find().sort({ createdAt: -1 });

      // CSV Header
      const csvHeader = [
        'Name',
        'Company Name',
        'Industry Type',
        'Designation',
        'City',
        'Rating',
        'Status',
        'Featured',
        'Date',
        'Feedback'
      ].join(',');

      // CSV Rows
      const csvRows = testimonials.map(t => {
        const escapeCsv = (value: string | undefined) => {
          if (!value) return '';
          const escaped = value.replace(/"/g, '""');
          return `"${escaped}"`;
        };

        return [
          escapeCsv(t.name),
          escapeCsv(t.companyName),
          escapeCsv(t.industryType),
          escapeCsv(t.designation),
          escapeCsv(t.city),
          t.rating || 5,
          t.status,
          t.isFeatured ? 'Yes' : 'No',
          t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
          escapeCsv(t.feedback)
        ].join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');

      console.log(`Exported ${testimonials.length} testimonials`);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=testimonials.csv');
      
      return res.status(200).send(csvContent);
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
