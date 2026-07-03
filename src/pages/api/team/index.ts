import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import TeamMember from "@/lib/models/TeamMember";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const { active } = req.query;
      const query: any = {};
      if (active === "true") {
        query.isActive = true;
      }

      // Fetch from database
      const members = await TeamMember.find(query);

      // Normalize legacy and new schema records for consistency
      const normalized = members.map((m) => {
        const doc = m.toObject ? m.toObject() : m;
        return {
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
          remark: doc.remark || doc.bio || "",
          parentId: doc.parentId ? String(doc.parentId) : null,
        };
      });

      normalized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      return res.status(200).json({ success: true, data: normalized });
    }

    if (req.method === "POST") {
      const { name, designation, department, remark, parentId, image, imagePublicId, order, isActive } = req.body;

      if (!name || !designation) {
        return res
          .status(400)
          .json({ success: false, message: "Name and designation are required." });
      }

      // Create new team member using schema-compatible properties
      const newMember = await TeamMember.create({
        name,
        designation,
        department: department || "",
        remark: remark || "",
        parentId: parentId || null,
        image: image || "",
        imagePublicId: imagePublicId || "",
        order: order ?? 0,
        isActive: isActive !== false,
      });

      return res.status(201).json({ success: true, data: newMember });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error: any) {
    console.error("Team API error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error" });
  }
}
