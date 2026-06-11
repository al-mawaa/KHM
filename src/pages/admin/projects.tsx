import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

const CATS = ["Government", "Residential", "Industrial", "Commercial"] as const;
const STATUS_OPTIONS = ["Active", "Upcoming"] as const;

interface Project {
  _id?: string;
  title: string;
  category: string;
  location: string;
  description: string;
  department: string;
  state: string;
  scope: string;
  status: string;
  type: string;
  image?: string;
  imagePublicId?: string;
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [edit, setEdit] = useState<Project | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from API...');
      setLoading(true);
      setError(null);
      const res = await fetch('/api/projects');
      const data = await res.json();
      console.log('API response:', data);
      
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const blank = (): Project => ({ 
    title: "", 
    category: "Commercial", 
    location: "", 
    description: "",
    department: "",
    state: "",
    scope: "",
    status: "Active",
    type: "",
    image: "",
    imagePublicId: ""
  });

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
    setUploading(true);
    setUploadProgress(0);

    try {
      // Read file as base64 data URL
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Simulate progress since we're using fetch (no XHR progress for JSON)
      setUploadProgress(30);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const save = async (p: Project) => {
    try {
      console.log('Saving project:', p);
      setSaving(true);
      setError(null);

      let image = p.image;
      let imagePublicId = p.imagePublicId;
      const oldImage = edit?.image;
      const oldImagePublicId = edit?.imagePublicId;

      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          image = uploadResult.url;
          imagePublicId = uploadResult.publicId;
          toast.success('Image uploaded successfully');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          setSaving(false);
          return;
        }
      }

      if (edit && oldImagePublicId && oldImagePublicId !== imagePublicId) {
        await deleteFile(oldImagePublicId);
      }

      const isEdit = !!p._id;
      const url = isEdit ? `/api/projects/${p._id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, image, imagePublicId }),
      });
      
      const data = await res.json();
      console.log('Save response:', data);
      
      if (data.success) {
        toast.success(isEdit ? 'Project updated successfully' : 'Project created successfully');
        await fetchProjects();
        setEdit(null);
        setSelectedFile(null);
        setPreviewImage(null);
      } else {
        setError(data.message || 'Failed to save project');
        toast.error(data.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project');
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting project:', id);
      
      const itemToDelete = items.find(item => item._id === id);
      if (itemToDelete?.imagePublicId) {
        await deleteFile(itemToDelete.imagePublicId);
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      console.log('Delete response:', data);
      
      if (data.success) {
        toast.success('Project deleted successfully');
        await fetchProjects();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete project');
        toast.error(data.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
      toast.error('Failed to delete project');
    }
  };

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <AdminShell title="Manage Projects">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...CATS].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === c ? "bg-aqua text-aqua-foreground" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{c}</button>
          ))}
        </div>
        <Button onClick={() => setEdit(blank())}><Plus className="h-4 w-4" /> Add Project</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading projects...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No projects found. Click "Add Project" to create one.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p._id} className="overflow-hidden">
              {p.image && <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />}
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-aqua-foreground">{p.category}</span>
                <h3 className="mt-1 font-display font-bold">{p.title}</h3>
                <p className="text-xs text-slate-500">{p.location}</p>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={() => { setEdit(p); setSelectedFile(null); setPreviewImage(p.image || null); }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="danger" onClick={() => setDel(p._id!)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!edit} onClose={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} title={edit && edit._id ? "Edit Project" : "Add Project"}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Title"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required /></Field>
            <Field label="Category"><Select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as typeof edit.category })}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Location"><Input value={edit.location} onChange={(e) => setEdit({ ...edit, location: e.target.value })} required /></Field>
            <Field label="Description"><Textarea rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} required /></Field>
            <Field label="Department"><Input value={edit.department} onChange={(e) => setEdit({ ...edit, department: e.target.value })} required /></Field>
            <Field label="State"><Input value={edit.state} onChange={(e) => setEdit({ ...edit, state: e.target.value })} required /></Field>
            <Field label="Scope"><Input value={edit.scope} onChange={(e) => setEdit({ ...edit, scope: e.target.value })} required /></Field>
            <Field label="Status"><Select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as typeof edit.status })}>{STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Type"><Input value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value })} required /></Field>
            <Field label="Project Image">
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
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} disabled={saving}>Cancel</Button><Button type="submit" disabled={saving || uploading}>{saving || uploading ? 'Saving...' : 'Save'}</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => handleDelete(del!)} message="Delete this project?" />
    </AdminShell>
  );
}
