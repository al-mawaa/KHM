import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Modal, Confirm } from "@/components/admin/ui";
import { Plus, Pencil, Trash2, Loader2, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface BlogItem {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImagePublicId?: string;
  tags?: string[];
  category?: string;
  readingTime?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [edit, setEdit] = useState<BlogItem | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBlogs = async () => {
    try {
      console.log('Fetching blog items...');
      setLoading(true);
      setError(null);
      const res = await fetch('/api/blog');
      const data = await res.json();
      console.log('API response:', data);
      
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.message || 'Failed to fetch blog items');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to fetch blog items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const blank = (): BlogItem => ({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    tags: [],
    category: undefined,
    readingTime: 0,
    isPublished: true
  });

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.');
      return;
    }

    // Validate file size (5MB)
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
    setUploading(true);
    setUploadProgress(0);

    try {
      // Convert file to base64 for Vercel compatibility
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        };

        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            
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
            });

            const data = await response.json();
            
            if (data.success) {
              resolve({ url: data.filePath, publicId: data.publicId });
            } else {
              reject(new Error(data.message || 'Upload failed'));
            }
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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

  const save = async (item: BlogItem) => {
    try {
      console.log('Saving blog item:', item);
      setSaving(true);
      setError(null);

      let featuredImage = item.featuredImage;
      let featuredImagePublicId = item.featuredImagePublicId;
      const oldFeaturedImage = edit?.featuredImage;
      const oldFeaturedImagePublicId = edit?.featuredImagePublicId;

      // Upload new file if selected
      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          featuredImage = uploadResult.url;
          featuredImagePublicId = uploadResult.publicId;
          toast.success('Image uploaded successfully');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          setSaving(false);
          return;
        }
      }

      // Delete old image from Cloudinary if editing and image changed
      if (edit && oldFeaturedImagePublicId && oldFeaturedImagePublicId !== featuredImagePublicId) {
        await deleteFile(oldFeaturedImagePublicId);
      }

      const isEdit = !!item._id;
      const url = isEdit ? `/api/blog/${item._id}` : '/api/blog';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, featuredImage, featuredImagePublicId }),
      });

      const data = await res.json();
      console.log('Save response:', data);

      if (data.success) {
        toast.success(isEdit ? 'Blog post updated successfully' : 'Blog post created successfully');
        await fetchBlogs();
        setEdit(null);
        setSelectedFile(null);
        setPreviewImage(null);
      } else {
        setError(data.message || 'Failed to save blog post');
        toast.error(data.message || 'Failed to save blog post');
      }
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError('Failed to save blog post');
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting blog item:', id);
      
      // Get the item to find its image public ID before deletion
      const itemToDelete = items.find(item => item._id === id);
      if (itemToDelete?.featuredImagePublicId) {
        await deleteFile(itemToDelete.featuredImagePublicId);
      }

      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('Delete response:', data);

      if (data.success) {
        toast.success('Blog post deleted successfully');
        await fetchBlogs();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete blog post');
        toast.error(data.message || 'Failed to delete blog post');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('Failed to delete blog post');
      toast.error('Failed to delete blog post');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setEdit({ ...edit!, tags });
  };

  return (
    <AdminShell title="Manage Blog">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEdit(blank()); setSelectedFile(null); setPreviewImage(null); }}><Plus className="h-4 w-4" /> New Post</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No blog posts available</p>
          <p className="text-slate-400 text-sm mt-2">Click "New Post" to create your first blog post</p>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Reading Time</th>
                  <th className="px-5 py-3">Tags</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.featuredImage && (
                          <img 
                            src={item.featuredImage} 
                            alt={item.title} 
                            className="h-12 w-12 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-xs text-slate-500">/{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{item.category || '-'}</td>
                    <td className="px-5 py-3 text-slate-600">{item.readingTime ? `${item.readingTime} min` : '-'}</td>
                    <td className="px-5 py-3 text-slate-600">{item.tags?.join(', ') || '-'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="secondary" onClick={() => { setEdit(item); setSelectedFile(null); setPreviewImage(item.featuredImage || null); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="danger" onClick={() => setDel(item._id!)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={!!edit} onClose={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} title={edit && edit._id ? "Edit Post" : "New Post"}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Title">
              <Input 
                value={edit.title} 
                onChange={(e) => setEdit({ ...edit, title: e.target.value })} 
                required 
                placeholder="Blog post title"
              />
            </Field>
            <Field label="Excerpt">
              <Textarea 
                rows={2} 
                value={edit.excerpt} 
                onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} 
                required
                placeholder="Brief excerpt for the blog post"
              />
            </Field>
            <Field label="Content">
              <Textarea 
                rows={8} 
                value={edit.content} 
                onChange={(e) => setEdit({ ...edit, content: e.target.value })} 
                required
                placeholder="Full blog content"
              />
            </Field>
            <Field label="Featured Image">
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
            <Field label="Category">
              <select
                value={edit.category || ''}
                onChange={(e) => setEdit({ ...edit, category: e.target.value || undefined })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua"
              >
                <option value="">Select category (optional)</option>
                <option value="Water Treatment">Water Treatment</option>
                <option value="Wastewater Treatment">Wastewater Treatment</option>
                <option value="Industrial Filtration">Industrial Filtration</option>
                <option value="RO Systems">RO Systems</option>
                <option value="ETP/STP">ETP/STP</option>
                <option value="Case Studies">Case Studies</option>
              </select>
            </Field>
            <Field label="Tags (comma separated)">
              <Input 
                value={edit.tags?.join(', ') || ''} 
                onChange={(e) => handleTagsChange(e.target.value)} 
                placeholder="water, treatment, plant"
              />
            </Field>
            <Field label="Publish Status">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edit.isPublished}
                    onChange={(e) => setEdit({ ...edit, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-aqua focus:ring-aqua"
                  />
                  <span className="text-sm text-slate-700">Published</span>
                </label>
                {!edit.isPublished && (
                  <span className="text-xs text-slate-500">(Draft)</span>
                )}
              </div>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" type="button" onClick={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving || uploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      
      <Confirm 
        open={!!del} 
        onClose={() => setDel(null)} 
        onConfirm={() => handleDelete(del!)} 
        message="Delete this blog post?" 
      />
    </AdminShell>
  );
}
