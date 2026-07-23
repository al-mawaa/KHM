import { useState, useEffect, useRef } from "react";

import { AdminShell } from "@/components/admin/AdminShell";

import { Card, Button, Modal, Confirm } from "@/components/admin/ui";

import {
  Upload,
  X,
  Loader2,
  ImageIcon as ImageIconLucide,
  Trash2,
  Check,
} from "lucide-react";

import { toast } from "sonner";

interface Banner {
  _id?: string;
  imageUrl: string;
  publicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function AdminManagementTeamBannerPage() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/management-team-banner");
      const data = await res.json();
      if (data.success) {
        setBanner(data.data);
        if (data.data?.imageUrl) {
          setPreviewImage(data.data.imageUrl);
        }
      } else {
        setError(data.message || "Failed to fetch banner");
      }
    } catch (err) {
      console.error("Error fetching banner:", err);
      setError("Failed to fetch banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // ─── Drag & Drop Image Handlers ───
  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(banner?.imageUrl || null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const uploadFile = async (file: File): Promise<{ url: string; publicId: string }> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      setUploadProgress(30);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      setUploadProgress(90);
      const data = await res.json();
      setUploadProgress(100);

      if (data.success) {
        return { url: data.filePath, publicId: data.publicId };
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ─── Save Action ───
  const saveBanner = async () => {
    if (!selectedFile && !previewImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      let imageUrl = banner?.imageUrl || "";
      let publicId = banner?.publicId || "";

      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          imageUrl = uploadResult.url;
          publicId = uploadResult.publicId;
          toast.success("Image uploaded successfully to Cloudinary");
        } catch (error: any) {
          console.error("Upload error:", error);
          toast.error(error.message || "Failed to upload image");
          setSaving(false);
          return;
        }
      }

      const res = await fetch("/api/management-team-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, publicId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Management Team Banner updated successfully.");
        await fetchBanner();
        setSelectedFile(null);
      } else {
        setError(data.message || "Failed to save banner");
        toast.error(data.message || "Failed to save banner");
      }
    } catch (err) {
      console.error("Error saving banner:", err);
      setError("Failed to save banner");
      toast.error("Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete Action ───
  const handleDelete = async () => {
    try {
      const res = await fetch("/api/management-team-banner", {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Banner deleted successfully.");
        await fetchBanner();
        setPreviewImage(null);
        setSelectedFile(null);
        setShowDeleteConfirm(false);
      } else {
        setError(data.message || "Failed to delete banner");
        toast.error(data.message || "Failed to delete banner");
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
      setError("Failed to delete banner");
      toast.error("Failed to delete banner");
    }
  };

  return (
    <AdminShell title="Management Team Banner">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-50 p-3 text-[#0B5FA5]">
            <ImageIconLucide className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">About This Section</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Management Team Banner image appears on the About page, immediately below the Team Hierarchy Tree.
              Upload one banner image to display in this section. Uploading a new image will automatically replace the previous one.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-[#1a5276]" /> Loading banner...
        </div>
      ) : (
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Banner Image</h3>
            <p className="text-sm text-slate-600">
              {banner ? "Current banner image is displayed below." : "No banner image has been uploaded yet."}
            </p>
          </div>

          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              selectedFile || previewImage
                ? "border-slate-300 bg-slate-50"
                : "border-slate-300 hover:border-[#0B5FA5] hover:bg-slate-50"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#0B5FA5]" />
                <p className="text-sm text-slate-600">Uploading image… {uploadProgress}%</p>
                <div className="w-full bg-slate-200 rounded-full h-2 max-w-md mx-auto">
                  <div
                    className="bg-[#0B5FA5] h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : previewImage ? (
              <div className="space-y-4">
                <div className="relative mx-auto max-w-2xl">
                  <img
                    src={previewImage}
                    alt="Banner Preview"
                    className="w-full h-auto rounded-lg shadow-md border border-slate-200"
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewImage(banner?.imageUrl || null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" /> Remove
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" /> Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIconLucide className="h-16 w-16 mx-auto text-slate-300" />
                <div>
                  <p className="text-base font-medium text-slate-700">
                    Drag and drop a banner image, or click to browse
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    JPG, JPEG, PNG, or WebP (max 10MB)
                  </p>
                </div>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Select Image
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {banner && (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Banner last updated: {banner.updatedAt ? new Date(banner.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {banner && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving || uploading}
                >
                  <Trash2 className="h-4 w-4" /> Delete Banner
                </Button>
              )}
              <Button
                onClick={saveBanner}
                disabled={saving || uploading || (!selectedFile && !banner)}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : banner ? (
                  "Update Banner"
                ) : (
                  "Upload Banner"
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Confirm
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete the Management Team Banner? This action will also remove the image from Cloudinary and the banner will no longer appear on the About page."
      />
    </AdminShell>
  );
}
