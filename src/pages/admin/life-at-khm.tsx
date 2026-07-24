import { useState, useEffect, useRef } from "react";

import { AdminShell } from "@/components/admin/AdminShell";

import { Card, Button, Modal, Confirm } from "@/components/admin/ui";

import {
  Upload,
  X,
  Loader2,
  Image as ImageIconLucide,
  Trash2,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

interface GalleryImage {
  _id: string;
  image: string;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminLifeAtKHMPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/life-at-khm");
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      } else {
        setError(data.message || "Failed to fetch gallery images");
      }
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to fetch gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ─── Drag & Drop Image Handlers ───
  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(null);
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
  const saveImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const uploadResult = await uploadFile(selectedFile);
      
      const res = await fetch("/api/life-at-khm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: uploadResult.url, 
          imagePublicId: uploadResult.publicId 
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Image uploaded successfully.");
        await fetchImages();
        setShowUploadModal(false);
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(data.message || "Failed to save image");
        toast.error(data.message || "Failed to save image");
      }
    } catch (err) {
      console.error("Error saving image:", err);
      setError("Failed to save image");
      toast.error("Failed to save image");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete Action ───
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/life-at-khm?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Image deleted successfully.");
        await fetchImages();
        setDeleteId(null);
      } else {
        setError(data.message || "Failed to delete image");
        toast.error(data.message || "Failed to delete image");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
      toast.error("Failed to delete image");
    }
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <AdminShell title="Life at KHM Gallery">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-pink-50 p-3 text-pink-600">
            <ImageIconLucide className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">About This Section</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Life at KHM gallery appears on the About page, displaying images of company events, team activities, and workplace culture.
              Upload images here to dynamically populate the gallery. Images will be displayed in the order they were added.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Gallery Images</h2>
          <p className="text-sm text-slate-600 mt-1">
            {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
          </p>
        </div>
        <Button onClick={openUploadModal}>
          <Plus className="h-4 w-4" /> Add Image
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-[#1a5276]" /> Loading gallery...
        </div>
      ) : images.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIconLucide className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No images uploaded yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            Upload your first image to get started with the Life at KHM gallery.
          </p>
          <Button onClick={openUploadModal}>
            <Plus className="h-4 w-4" /> Add First Image
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <Card key={img._id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={img.image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(img._id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Added: {new Date(img.createdAt).toLocaleDateString()}</span>
                  <span>#{index + 1}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        open={showUploadModal}
        onClose={closeUploadModal}
        title="Upload Gallery Image"
      >
        <div className="space-y-4">
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
                <div className="relative mx-auto max-w-md">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-auto rounded-lg shadow-md border border-slate-200"
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewImage(null);
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
                    <Upload className="h-4 w-4" /> Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIconLucide className="h-16 w-16 mx-auto text-slate-300" />
                <div>
                  <p className="text-base font-medium text-slate-700">
                    Drag and drop an image, or click to browse
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="secondary"
              type="button"
              onClick={closeUploadModal}
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={saveImage}
              disabled={saving || uploading || !selectedFile}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                </>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        message="Are you sure you want to delete this image? This action will also remove the image from Cloudinary and it will no longer appear in the Life at KHM gallery."
      />
    </AdminShell>
  );
}
