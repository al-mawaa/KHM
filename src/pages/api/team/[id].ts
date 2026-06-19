import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import TeamMember from "@/lib/models/TeamMember";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using existing environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const member = await TeamMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: "Team member not found" });
      }
      const doc = member.toObject ? member.toObject() : member;
      const normalized = {
        ...doc,
        name: doc.name || doc.fullName || "",
        image: doc.image || doc.profileImage || "",
        imagePublicId: doc.imagePublicId || doc.profileImagePublicId || "",
        order:
          doc.order !== undefined
            ? doc.order
            : doc.displayOrder !== undefined
              ? doc.displayOrder
              : 0,
        isActive: doc.isActive !== undefined ? doc.isActive : doc.status !== "Inactive",
        role: doc.role || "employee",
        remark: doc.remark || doc.bio || "",
        parentId: doc.parentId ? String(doc.parentId) : null,
      };
      return res.status(200).json({ success: true, data: normalized });
    }

    if (req.method === "PUT") {
      const { name, designation, role, department, remark, parentId, image, imagePublicId, order, isActive } =
        req.body;

      if (!name || !designation || !role) {
        return res
          .status(400)
          .json({ success: false, message: "Name, designation, and role are required." });
      }

      if (role !== "director" && role !== "subdirector" && role !== "employee") {
        return res.status(400).json({ success: false, message: "Invalid role value." });
      }

      const member = await TeamMember.findByIdAndUpdate(
        id,
        { name, designation, role, department, remark, parentId: parentId || null, image, imagePublicId, order, isActive },
        { new: true, runValidators: true },
      );

      if (!member) {
        return res.status(404).json({ success: false, message: "Team member not found" });
      }

      return res.status(200).json({ success: true, data: member });
    }

    if (req.method === "DELETE") {
      const member = await TeamMember.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: "Team member not found" });
      }

      // Delete Cloudinary image if it exists
      if (member.imagePublicId) {
        try {
          const destroyResult = await cloudinary.uploader.destroy(member.imagePublicId);
          console.log(`Cloudinary image delete result for ${member.imagePublicId}:`, destroyResult);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", err);
        }
      }

      await TeamMember.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Team member deleted successfully" });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error: any) {
    console.error("Team member detail API error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error" });
  }
}
