import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Blog, { IBlog } from '@/lib/models/Blog';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to ensure unique slug
async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    console.log(`API ${req.method} /api/blog`);
    
    if (req.method === 'GET') {
      console.log('Fetching all blogs...');
      
      // Check if published filter is requested
      const { published, search, category, page, limit } = req.query;
      const filter: any = {};
      
      if (published === 'true') {
        filter.isPublished = true;
      }
      
      // Search functionality
      if (search && typeof search === 'string') {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      
      // Category filter
      if (category && typeof category === 'string') {
        filter.category = category;
      }
      
      // Pagination
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 6;
      const skip = (pageNum - 1) * limitNum;
      
      // Sort by isPublished (true first), then createdAt (newest first)
      const blogs = await Blog.find(filter)
        .sort({ isPublished: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
      
      const total = await Blog.countDocuments(filter);
      
      console.log(`Found ${blogs.length} blogs (page ${pageNum}, limit ${limitNum}, total ${total})`);
      return res.status(200).json({ 
        success: true, 
        data: blogs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        }
      });
    }

    if (req.method === 'POST') {
      console.log('Creating blog with body:', req.body);
      const { title, excerpt, content, featuredImage, tags, category, isPublished } = req.body;

      // Validation
      if (!title) {
        console.log('Validation failed: missing title');
        return res.status(400).json({ 
          success: false, 
          message: 'Title is required' 
        });
      }

      if (!excerpt) {
        console.log('Validation failed: missing excerpt');
        return res.status(400).json({ 
          success: false, 
          message: 'Excerpt is required' 
        });
      }

      if (!content) {
        console.log('Validation failed: missing content');
        return res.status(400).json({ 
          success: false, 
          message: 'Content is required' 
        });
      }

      if (!featuredImage) {
        console.log('Validation failed: missing featuredImage');
        return res.status(400).json({ 
          success: false, 
          message: 'Featured image is required' 
        });
      }

      // Generate slug from title
      const baseSlug = generateSlug(title);
      const uniqueSlug = await getUniqueSlug(baseSlug);

      // Calculate reading time
      const readingTime = calculateReadingTime(content);

      const blog = await Blog.create({
        title,
        slug: uniqueSlug,
        excerpt,
        content,
        featuredImage,
        tags: tags || [],
        category: category || undefined,
        readingTime,
        isPublished: isPublished !== undefined ? isPublished : true,
      });

      console.log('Blog created successfully:', blog);
      return res.status(201).json({ success: true, data: blog });
    }

    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('API error:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(409).json({ 
        success: false, 
        message: 'A blog with this slug already exists' 
      });
    }
    
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
