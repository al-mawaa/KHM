import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import LifeAtKHM from "@/lib/models/LifeAtKHM";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "GET") {
      // Fetch all images sorted by creation date (oldest first)
      const images = await LifeAtKHM.find().sort({ createdAt: 1 });

      return res.status(200).json({ success: true, data: images });
    }

    if (req.method === "POST") {
      const { image, imagePublicId } = req.body;

      if (!image || !imagePublicId) {
        return res.status(400).json({ success: false, message: "Image URL and public ID are required." });
      }

      // Create new gallery image
      const newImage = await LifeAtKHM.create({
        image,
        imagePublicId,
      });

      return res.status(201).json({ success: true, data: newImage });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: "Image ID is required" });
      }

      // Find the image
      const galleryImage = await LifeAtKHM.findById(id);

      if (!galleryImage) {
        return res.status(404).json({ success: false, message: "Image not found" });
      }

      // Delete from Cloudinary
      if (galleryImage.imagePublicId) {
        try {
          const destroyResult = await cloudinary.uploader.destroy(galleryImage.imagePublicId);
          console.log(`Cloudinary image delete result:`, destroyResult);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", err);
        }
      }

      await LifeAtKHM.findByIdAndDelete(id);

      return res.status(200).json({ success: true, message: "Image deleted successfully" });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error: any) {
    console.error("Life at KHM API error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
}
