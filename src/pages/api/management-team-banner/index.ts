import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import ManagementTeamBanner from "@/lib/models/ManagementTeamBanner";
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
      // Fetch the single banner document (most recent one)
      const banner = await ManagementTeamBanner.findOne().sort({ createdAt: -1 });

      if (!banner) {
        return res.status(200).json({ success: true, data: null });
      }

      return res.status(200).json({ success: true, data: banner });
    }

    if (req.method === "POST") {
      const { imageUrl, publicId } = req.body;

      if (!imageUrl || !publicId) {
        return res.status(400).json({ success: false, message: "Image URL and public ID are required." });
      }

      // Delete any existing banner and its Cloudinary image
      const existingBanner = await ManagementTeamBanner.findOne().sort({ createdAt: -1 });
      if (existingBanner && existingBanner.publicId) {
        try {
          await cloudinary.uploader.destroy(existingBanner.publicId);
          console.log(`Deleted old banner image from Cloudinary: ${existingBanner.publicId}`);
        } catch (err) {
          console.error("Failed to delete old banner image from Cloudinary:", err);
        }
        await ManagementTeamBanner.deleteMany({});
      }

      // Create new banner
      const newBanner = await ManagementTeamBanner.create({
        imageUrl,
        publicId,
      });

      return res.status(201).json({ success: true, data: newBanner });
    }

    if (req.method === "DELETE") {
      // Find and delete the banner
      const banner = await ManagementTeamBanner.findOne().sort({ createdAt: -1 });

      if (!banner) {
        return res.status(404).json({ success: false, message: "No banner found" });
      }

      // Delete from Cloudinary
      if (banner.publicId) {
        try {
          const destroyResult = await cloudinary.uploader.destroy(banner.publicId);
          console.log(`Cloudinary banner image delete result:`, destroyResult);
        } catch (err) {
          console.error("Failed to delete banner image from Cloudinary:", err);
        }
      }

      await ManagementTeamBanner.deleteMany({});

      return res.status(200).json({ success: true, message: "Banner deleted successfully" });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error: any) {
    console.error("Management Team Banner API error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
}
