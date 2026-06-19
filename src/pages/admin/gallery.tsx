import { useState, useEffect, useRef } from "react";

import { AdminShell } from "@/components/admin/AdminShell";

import { Card, Button, Field, Input, Modal, Confirm } from "@/components/admin/ui";

import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Upload, X } from "lucide-react";

import { toast } from "sonner";



interface GalleryItem {

  _id?: string;

  title: string;

  imageUrl: string;

  imagePublicId?: string;

  description?: string;

  category?: string;

  createdAt?: string;

  updatedAt?: string;

}



export default function AdminGalleryPage() {

  const [items, setItems] = useState<GalleryItem[]>([]);

  const [edit, setEdit] = useState<GalleryItem | null>(null);

  const [del, setDel] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);



  const fetchGallery = async () => {

    try {

      console.log('Fetching gallery items...');

      setLoading(true);

      setError(null);

      const res = await fetch('/api/gallery');

      const data = await res.json();

      console.log('API response:', data);

      

      if (data.success) {

        setItems(data.data);

      } else {

        setError(data.message || 'Failed to fetch gallery items');

      }

    } catch (err) {

      console.error('Error fetching gallery:', err);

      setError('Failed to fetch gallery items');

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchGallery();

  }, []);



  const blank = (): GalleryItem => ({

    title: "",

    imageUrl: "",

    description: "",

    category: ""

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

    setUploadProgress(10);



    try {

      // Convert file to base64 for the API

      const base64 = await new Promise<string>((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as string);

        reader.onerror = () => reject(new Error('Failed to read file'));

        reader.readAsDataURL(file);

      });



      setUploadProgress(40);



      const response = await fetch('/api/upload', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          file: base64,

          fileName: file.name,

          mimeType: file.type,

        }),

      });



      setUploadProgress(90);



      const data = await response.json();



      if (data.success) {

        setUploadProgress(100);

        return { url: data.filePath, publicId: data.publicId };

      } else {

        throw new Error(data.message || 'Upload failed');

      }

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



  const save = async (item: GalleryItem) => {

    try {

      console.log('Saving gallery item:', item);

      setSaving(true);

      setError(null);



      let imageUrl = item.imageUrl;

      let imagePublicId = item.imagePublicId;

      const oldImageUrl = edit?.imageUrl;

      const oldImagePublicId = edit?.imagePublicId;



      // Upload new file if selected

      if (selectedFile) {

        try {

          const uploadResult = await uploadFile(selectedFile);

          imageUrl = uploadResult.url;

          imagePublicId = uploadResult.publicId;

          toast.success('Image uploaded successfully');

        } catch (error) {

          console.error('Upload error:', error);

          toast.error('Failed to upload image');

          setSaving(false);

          return;

        }

      }



      // Delete old image from Cloudinary if editing and image changed

      if (edit && oldImagePublicId && oldImagePublicId !== imagePublicId) {

        await deleteFile(oldImagePublicId);

      }



      const isEdit = !!item._id;

      const url = isEdit ? `/api/gallery/${item._id}` : '/api/gallery';

      const method = isEdit ? 'PUT' : 'POST';



      const res = await fetch(url, {

        method,

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ ...item, imageUrl, imagePublicId }),

      });



      const data = await res.json();

      console.log('Save response:', data);



      if (data.success) {

        toast.success(isEdit ? 'Gallery item updated successfully' : 'Gallery item created successfully');

        await fetchGallery();

        setEdit(null);

        setSelectedFile(null);

        setPreviewImage(null);

      } else {

        setError(data.message || 'Failed to save gallery item');

        toast.error(data.message || 'Failed to save gallery item');

      }

    } catch (err) {

      console.error('Error saving gallery item:', err);

      setError('Failed to save gallery item');

      toast.error('Failed to save gallery item');

    } finally {

      setSaving(false);

    }

  };



  const handleDelete = async (id: string) => {

    try {

      console.log('Deleting gallery item:', id);

      

      // Get the item to find its image public ID before deletion

      const itemToDelete = items.find(item => item._id === id);

      if (itemToDelete?.imagePublicId) {

        await deleteFile(itemToDelete.imagePublicId);

      }



      const res = await fetch(`/api/gallery/${id}`, {

        method: 'DELETE',

      });



      const data = await res.json();

      console.log('Delete response:', data);



      if (data.success) {

        toast.success('Gallery item deleted successfully');

        await fetchGallery();

        setDel(null);

      } else {

        setError(data.message || 'Failed to delete gallery item');

        toast.error(data.message || 'Failed to delete gallery item');

      }

    } catch (err) {

      console.error('Error deleting gallery item:', err);

      setError('Failed to delete gallery item');

      toast.error('Failed to delete gallery item');

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



  return (

    <AdminShell title="Manage Gallery">

      {error && (

        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">

          {error}

        </div>

      )}

      

      <div className="flex justify-end mb-4">

        <Button onClick={() => { setEdit(blank()); setSelectedFile(null); setPreviewImage(null); }}><Plus className="h-4 w-4" /> Add Gallery Item</Button>

      </div>



      {loading ? (

        <div className="flex items-center justify-center py-12">

          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />

        </div>

      ) : items.length === 0 ? (

        <div className="text-center py-12">

          <ImageIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />

          <p className="text-slate-500 text-lg">No gallery items added yet</p>

          <p className="text-slate-400 text-sm mt-2">Click "Add Gallery Item" to create your first gallery item</p>

        </div>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {items.map((item) => (

            <Card key={item._id} className="overflow-hidden">

              {item.imageUrl ? (

                <img 

                  src={item.imageUrl} 

                  alt={item.title} 

                  className="h-48 w-full object-cover"

                  onError={(e) => {

                    (e.target as HTMLImageElement).style.display = 'none';

                  }}

                />

              ) : (

                <div className="h-48 w-full bg-slate-100 flex items-center justify-center">

                  <ImageIcon className="h-12 w-12 text-slate-300" />

                </div>

              )}

              <div className="p-5">

                <h3 className="font-display font-bold text-lg">{item.title}</h3>

                <p className="mt-2 text-sm text-slate-600">{item.category}</p>

                <p className="mt-3 text-xs text-slate-400">Added: {formatDate(item.createdAt)}</p>

                <div className="mt-4 flex gap-2">

                  <Button variant="secondary" onClick={() => { setEdit(item); setSelectedFile(null); setPreviewImage(item.imageUrl || null); }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>

                  <Button variant="danger" onClick={() => setDel(item._id!)}><Trash2 className="h-3.5 w-3.5" /></Button>

                </div>

              </div>

            </Card>

          ))}

        </div>

      )}



      <Modal open={!!edit} onClose={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} title={edit && edit._id ? "Edit Gallery Item" : "Add Gallery Item"}>

        {edit && (

          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">

            <Field label="Title">

              <Input 

                value={edit.title} 

                onChange={(e) => setEdit({ ...edit, title: e.target.value })} 

                required 

                placeholder="Gallery item title"

              />

            </Field>

            <Field label="Category">

              <Input 

                value={edit.category || ""} 

                onChange={(e) => setEdit({ ...edit, category: e.target.value })} 

                placeholder="Gallery item category (e.g., Water Treatment, Infrastructure, Industrial Projects)"

              />

            </Field>

            <Field label="Image">

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

        message="Delete this gallery item?" 

      />

    </AdminShell>

  );

}

