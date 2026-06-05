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

// Helper function to ensure unique slug (excluding current document)
async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  const filter: any = { slug };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  
  while (await Blog.findOne(filter)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Update filter for new slug
    filter.slug = slug;
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

  const { id } = req.query;

  try {
    console.log(`API ${req.method} /api/blog/${id}`);
    
    if (req.method === 'GET') {
      console.log('Fetching blog by id:', id);
      const blog = await Blog.findById(id);
      
      if (!blog) {
        console.log('Blog not found');
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      console.log('Blog found:', blog);
      return res.status(200).json({ success: true, data: blog });
    }

    if (req.method === 'PUT') {
      console.log('Updating blog:', id, 'with body:', req.body);
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

      // Generate new slug if title changed
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
        console.log('Blog not found for update');
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      let newSlug = existingBlog.slug;
      if (title !== existingBlog.title) {
        const baseSlug = generateSlug(title);
        newSlug = await getUniqueSlug(baseSlug, id as string);
      }

      // Recalculate reading time if content changed
      const readingTime = content !== existingBlog.content ? calculateReadingTime(content) : existingBlog.readingTime;

      const updateData: any = {
        title,
        slug: newSlug,
        excerpt,
        content,
        featuredImage,
        tags: tags || [],
        category: category !== undefined ? category : existingBlog.category,
        readingTime,
      };

      if (isPublished !== undefined) {
        updateData.isPublished = isPublished;
      }

      const blog = await Blog.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!blog) {
        console.log('Blog not found for update');
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      console.log('Blog updated successfully:', blog);
      return res.status(200).json({ success: true, data: blog });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting blog:', id);
      const blog = await Blog.findByIdAndDelete(id);

      if (!blog) {
        console.log('Blog not found for deletion');
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      console.log('Blog deleted successfully');
      return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
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
