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
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Processing resume upload to Cloudinary...');

    // Check for base64 encoded file (Vercel compatible approach)
    const { file, fileName, mimeType } = req.body;

    if (file && fileName && mimeType) {
      // Base64 upload approach for Vercel
      const base64Data = file.replace(/^data:application\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Validate file type
      const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.' });
      }

      // Validate file size (3.5MB to account for base64 overhead)
      const maxSize = 3.5 * 1024 * 1024;
      if (buffer.length > maxSize) {
        return res.status(400).json({ success: false, message: 'File size exceeds 3.5MB limit.' });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const publicId = `career-resumes/${sanitizedName.replace(/\.[^/.]+$/, '')}-${timestamp}`;

      // Upload to Cloudinary using buffer
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: 'career-resumes',
            resource_type: 'raw',
            allowed_formats: ['pdf', 'doc', 'docx'],
            use_filename: true,
            unique_filename: false,
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

      console.log('Resume uploaded successfully to Cloudinary:', result.secure_url);

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

    const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
    
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

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
    
    fs.unlinkSync(uploadedFile.filepath);

    console.log('Resume uploaded successfully to Cloudinary:', result.secure_url);

    return res.status(200).json({ 
      success: true, 
      filePath: result.secure_url,
      publicId: result.public_id 
    });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    
    // Handle 413 Payload Too Large error
    if (error.type === 'entity.too.large' || error.code === 'FST_ERR_CTP_FILE_TOO_LARGE' || error.message?.includes('413')) {
      return res.status(413).json({ success: false, message: 'File size exceeds 3.5MB limit. Please choose a smaller file.' });
    }
    
    // Handle file size errors
    if (error.code === 1002) {
      return res.status(400).json({ success: false, message: 'File size exceeds 3.5MB limit' });
    }
    
    // Handle format errors
    if (error.code === 1005) {
      return res.status(400).json({ success: false, message: 'Invalid file format. Only PDF, DOC, and DOCX are allowed' });
    }
    
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
}
