import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Blog, { IBlog } from '@/lib/models/Blog';
import redis from '@/lib/redis';

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
  try {
    console.log(`🚀 API ${req.method} /api/blog`);
    console.log('📝 Request query:', req.query);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    await connectDB();

    if (req.method === 'GET') {
      console.log('📖 Fetching all blogs...');

      // Check if published filter is requested
      const { published, search, category, page, limit, fields } = req.query;
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
          { content: { $regex: search, $options: 'i' } },
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

      // Only cache the default listing (no search/filter params)
      const isDefaultRequest = !search && !category && page === '1' || !page

      const cacheKey = `blogs:published:page${page || 1}` 

      if (isDefaultRequest && redis) {
        try {
          const cached = await redis.get(cacheKey)
          if (cached) {
            console.log('Serving blogs from Redis cache')
            return res.status(200).json({ success: true, ...(cached as any), fromCache: true })
          }
        } catch (cacheError) {
          console.error('Redis cache read error:', cacheError)
        }
      }

      // Select fields for performance optimization
      // If 'fields' query param is set to 'listing', only fetch fields needed for listing page
      const selectFields = fields === 'listing'
        ? 'title slug excerpt featuredImage tags category readingTime isPublished createdAt updatedAt'
        : '';

      // Sort by isPublished (true first), then createdAt (newest first)
      const blogs = await Blog.find(filter)
        .select(selectFields)
        .sort({ isPublished: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const total = await Blog.countDocuments(filter);

      // After fetching, store in cache (10 minutes for blogs)
      if (isDefaultRequest && redis) {
        try {
          await redis.set(cacheKey, JSON.stringify({ data: blogs, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } }), { ex: 600 })
          console.log('Blogs cached in Redis')
        } catch (cacheError) {
          console.error('Redis cache write error:', cacheError)
        }
      }

      console.log(`✅ Found ${blogs.length} blogs (page ${pageNum}, limit ${limitNum}, total ${total})`);
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
      console.log('➕ Creating blog with body:', req.body);
      const { title, excerpt, content, featuredImage, tags, category, isPublished } = req.body;

      // Validation
      if (!title) {
        console.log('❌ Validation failed: missing title');
        return res.status(400).json({ 
          success: false, 
          message: 'Title is required' 
        });
      }

      if (!excerpt) {
        console.log('❌ Validation failed: missing excerpt');
        return res.status(400).json({ 
          success: false, 
          message: 'Excerpt is required' 
        });
      }

      if (!content) {
        console.log('❌ Validation failed: missing content');
        return res.status(400).json({ 
          success: false, 
          message: 'Content is required' 
        });
      }

      if (!featuredImage) {
        console.log('❌ Validation failed: missing featuredImage');
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

      console.log('✅ Blog created successfully:', blog._id);
      
      // Invalidate cache
      if (redis) {
        try {
          await redis.del('blogs:published:page1')
          console.log('Blog cache invalidated')
        } catch (cacheError) {
          console.error('Redis cache invalidation error:', cacheError)
        }
      }
      
      return res.status(201).json({ success: true, data: blog });
    }

    console.log(`❌ Method ${req.method} not allowed`);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(409).json({ 
        success: false, 
        message: 'A blog with this slug already exists' 
      });
    }
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError') {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + error.message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
