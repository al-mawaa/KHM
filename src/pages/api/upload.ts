import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { publicId } = req.query;
      
      if (!publicId || typeof publicId !== 'string') {
        return res.status(400).json({ success: false, message: 'Public ID is required' });
      }

      console.log('Attempting to delete Cloudinary image:', publicId);

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
      
      console.log('Cloudinary delete result:', result);

      if (result.result === 'ok' || result.result === 'not found') {
        return res.status(200).json({ success: true, message: 'Image deleted successfully' });
      } else {
        return res.status(500).json({ success: false, message: 'Failed to delete image' });
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Delete failed' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Processing file upload to Cloudinary...');

    // Check for base64 encoded file (Vercel compatible approach)
    const { file, fileName, mimeType } = req.body;

    if (file && fileName && mimeType) {
      // Base64 upload approach for Vercel
      const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' });
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (buffer.length > maxSize) {
        return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit.' });
      }

      // Upload to Cloudinary using buffer
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'khm-uploads',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        
        uploadStream.end(buffer);
      });

      const result = await uploadPromise as any;

      console.log('File uploaded successfully to Cloudinary:', result.secure_url);

      return res.status(200).json({ 
        success: true, 
        filePath: result.secure_url,
        publicId: result.public_id 
      });
    }

    // Fallback to formidable for local development
    const formidable = (await import('formidable')).default;
    const fs = (await import('fs')).default;

    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: function ({ name, originalFilename, mimetype }) {
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

    const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
    
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'khm-uploads',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
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
    
    fs.unlinkSync(uploadedFile.filepath);

    console.log('File uploaded successfully to Cloudinary:', result.secure_url);

    return res.status(200).json({ 
      success: true, 
      filePath: result.secure_url,
      publicId: result.public_id 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
}
