import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
    console.log('Processing resume upload to Cloudinary...');

    // Parse form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: function ({ name, originalFilename, mimetype }) {
        // Keep only document files
        const allowedMimeTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return mimetype ? allowedMimeTypes.includes(mimetype) : false;
      },
    });

    const [fields, files] = await form.parse(req);
    console.log('Files received:', files);

    const uploadedFiles = files.resume;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
    
    // Read file from temp path
    const fileBuffer = fs.readFileSync(file.filepath);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'career-resumes',
          resource_type: 'raw',
          allowed_formats: ['pdf', 'doc', 'docx'],
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(fileBuffer);
    });

    const result = await uploadPromise as any;
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);

    console.log('Resume uploaded successfully to Cloudinary:', result.secure_url);

    return res.status(200).json({ 
      success: true, 
      filePath: result.secure_url,
      publicId: result.public_id 
    });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    
    // Handle file size errors
    if (error.code === 1002) {
      return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
    }
    
    // Handle format errors
    if (error.code === 1005) {
      return res.status(400).json({ success: false, message: 'Invalid file format. Only PDF, DOC, and DOCX are allowed' });
    }
    
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
}
