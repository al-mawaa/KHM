import { useState, useEffect, useRef } from 'react';
import { IService } from '@/lib/models/Service';
import { Button, Field, Input, Textarea } from '@/components/admin/ui';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceFormProps {
  service?: IService;
  onSubmit: (data: Partial<IService>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServiceForm({ service, onSubmit, onCancel, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = useState<Partial<IService>>({
    title: '',
    slug: '',
    description: '',
    icon: 'Droplets',
    category: '',
    points: [],
    image: '',
    imagePublicId: '',
  });

  const [pointsText, setPointsText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isUploadingRef = useRef(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        slug: service.slug,
        description: service.description,
        icon: service.icon,
        category: service.category,
        points: service.points,
        image: service.image || '',
        imagePublicId: service.imagePublicId || '',
      });
      setPointsText(service.points?.join('\n') || '');
      setPreviewImage(service.image || null);
    }
  }, [service]);

  useEffect(() => {
    return () => {
      // Abort any ongoing upload when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isUploadingRef.current = false;
    };
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit.');
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
    if (isUploadingRef.current) {
      throw new Error('Upload already in progress');
    }

    isUploadingRef.current = true;

    // Cancel any previous upload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          
          setUploadProgress(30);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
              mimeType: file.type,
            }),
            signal: abortController.signal,
          });

          setUploadProgress(70);

          const data = await response.json();

          if (data.success) {
            setUploadProgress(100);
            resolve({ url: data.filePath, publicId: data.publicId });
          } else {
            reject(new Error(data.message || 'Upload failed'));
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            reject(new Error('Upload aborted'));
          } else {
            reject(error);
          }
        } finally {
          abortControllerRef.current = null;
          isUploadingRef.current = false;
        }
      };

      reader.onerror = () => {
        abortControllerRef.current = null;
        isUploadingRef.current = false;
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteFile = async (publicId: string) => {
    try {
      if (!publicId) {
        console.log('No public ID provided for deletion');
        return;
      }

      const res = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        console.log('Cloudinary image deleted successfully:', publicId);
      } else {
        console.error('Failed to delete image:', data.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: value.trim() ? generateSlug(value) : formData.slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploading || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setUploading(true);

    const pointsArray = pointsText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    let image = formData.image;
    let imagePublicId = formData.imagePublicId;
    const oldImage = service?.image;
    const oldImagePublicId = service?.imagePublicId;

    if (selectedFile) {
      try {
        const uploadResult = await uploadFile(selectedFile);
        image = uploadResult.url;
        imagePublicId = uploadResult.publicId;
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        setUploading(false);
        setUploadProgress(0);
        isSubmittingRef.current = false;
        return;
      }
    }

    if (service && oldImagePublicId && oldImagePublicId !== imagePublicId) {
      await deleteFile(oldImagePublicId);
    }

    onSubmit({ ...formData, points: pointsArray, image, imagePublicId });
    setUploading(false);
    setUploadProgress(0);
    isSubmittingRef.current = false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Title (optional)">
        <Input
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Service title"
        />
      </Field>
      
      <Field label="Slug">
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          placeholder="service-slug"
        />
      </Field>
      
      <Field label="Category">
        <Input
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          placeholder="e.g., Water Supply, Civil Infrastructure"
        />
      </Field>
      
      <Field label="Icon (lucide-react icon name)">
        <Input
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="Droplets"
        />
      </Field>
      
      <Field label="Description">
        <Textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          placeholder="Service description"
        />
      </Field>
      
      <Field label="Points (optional, one per line)">
        <Textarea
          rows={6}
          value={pointsText}
          onChange={(e) => setPointsText(e.target.value)}
          placeholder="Point 1&#10;Point 2&#10;Point 3"
        />
      </Field>

      <Field label="Service Image (optional)">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            selectedFile || previewImage
              ? 'border-slate-300 bg-slate-50'
              : 'border-slate-300 hover:border-aqua hover:bg-slate-50'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-aqua" />
              <p className="text-sm text-slate-600">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-aqua h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : previewImage ? (
            <div className="space-y-3">
              <img
                src={previewImage}
                alt="Preview"
                className="h-48 w-full object-cover rounded-lg mx-auto"
              />
              <div className="flex justify-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
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
            <div className="space-y-3">
              <Upload className="h-12 w-12 mx-auto text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, JPEG, PNG, or WebP (max 5MB)
                </p>
              </div>
              <Button
                variant="secondary"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Image
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
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={() => { onCancel(); setSelectedFile(null); setPreviewImage(null); }} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || uploading}>
          {isLoading || uploading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
