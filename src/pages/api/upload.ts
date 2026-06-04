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
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Processing file upload...');

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    }

    // Parse form data
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (name: string, ext: string, part: any) => {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${randomString}${ext}`;
      },
    });

    const [fields, files] = await form.parse(req);
    console.log('Files received:', files);

    const uploadedFiles = files.file;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
    const filePath = `/uploads/gallery/${file.newFilename}`;

    console.log('File uploaded successfully:', filePath);
    return res.status(200).json({ success: true, filePath });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
}
