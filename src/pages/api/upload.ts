import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { filePath } = req.query;
      
      if (!filePath || typeof filePath !== 'string') {
        return res.status(400).json({ success: false, message: 'File path is required' });
      }

      // Remove leading slash if present
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);

      console.log('Attempting to delete file:', fullPath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.log('File not found:', fullPath);
        return res.status(404).json({ success: false, message: 'File not found' });
      }

      // Delete file
      fs.unlinkSync(fullPath);
      console.log('File deleted successfully:', fullPath);

      return res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Delete failed' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Processing file upload...');

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    }

    // Parse form data
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (name: string, ext: string, part: any) => {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${randomString}${ext}`;
      },
      filter: function ({ name, originalFilename, mimetype }) {
        // Keep only image files
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        return mimetype ? allowedMimeTypes.includes(mimetype) : false;
      },
    });

    const [fields, files] = await form.parse(req);
    console.log('Files received:', files);

    const uploadedFiles = files.file;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
    const filePath = `/uploads/${file.newFilename}`;

    console.log('File uploaded successfully:', filePath);
    return res.status(200).json({ success: true, filePath });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
}
