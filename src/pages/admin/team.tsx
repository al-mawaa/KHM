import { useState, useRef, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Modal, Confirm } from "@/components/admin/ui";
import type { TeamMemberData as TeamMember } from "@/lib/models/TeamMember";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";

type TeamMemberForm = Omit<TeamMember, 'createdAt' | 'updatedAt'>;
import { toast } from "sonner";

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [edit, setEdit] = useState<TeamMemberForm | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blank = (): TeamMemberForm => ({ id: "", name: "", role: "", bio: "", image: "", imagePublicId: "" });

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
      } else {
        console.error('Failed to load team members', data.message);
      }
    } catch (error) {
      console.error('Failed to load team members', error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

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
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve({ url: response.filePath, publicId: response.publicId });
            } else {
              reject(new Error(response.message || 'Upload failed'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
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

  const save = async (t: TeamMemberForm) => {
    let image = t.image;
    let imagePublicId = t.imagePublicId;
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
        return;
      }
    }

    let savedMember: TeamMember | null = null;

    try {
      const response = await fetch(edit && edit.id ? `/api/team/${edit.id}` : '/api/team', {
        method: edit && edit.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: t.name,
          role: t.role,
          bio: t.bio,
          image,
          imagePublicId,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save team member');
      }
      savedMember = data.data;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save team member');
      return;
    }

    if (edit && oldImagePublicId && oldImagePublicId !== imagePublicId) {
      await deleteFile(oldImagePublicId);
    }

    if (savedMember) {
      setItems((current) => {
        const existingIndex = current.findIndex((i) => i.id === savedMember!.id);
        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = savedMember!;
          return next;
        }
        return [savedMember!, ...current];
      });
    }

    setEdit(null);
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!del) return;
    const member = items.find((item) => item.id === del);

    try {
      const res = await fetch(`/api/team/${del}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete team member');
      }
      if (member?.imagePublicId) {
        await deleteFile(member.imagePublicId);
      }
      setItems((current) => current.filter((item) => item.id !== del));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete team member');
    } finally {
      setDel(null);
    }
  };

  return (
    <AdminShell title="Manage Team Members">
      <div className="flex justify-end mb-4"><Button onClick={() => setEdit(blank())}><Plus className="h-4 w-4" /> Add Member</Button></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Card key={t.id} className="p-5 text-center">
            {t.image
              ? <img src={t.image} alt={t.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
              : <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-aqua text-2xl font-bold text-primary-foreground">{t.name.charAt(0) || "?"}</div>}
            <h3 className="mt-3 font-display font-bold">{t.name}</h3>
            <div className="text-xs text-aqua-foreground font-semibold uppercase tracking-wider">{t.role}</div>
            <p className="mt-2 text-sm text-slate-600">{t.bio}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="secondary" onClick={() => { setEdit(t); setSelectedFile(null); setPreviewImage(t.image || null); }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
              <Button variant="danger" onClick={() => { if (t.imagePublicId) deleteFile(t.imagePublicId); setDel(t.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} title="Team Member">
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required /></Field>
            <Field label="Role"><Input value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} required /></Field>
            <Field label="Bio"><Textarea rows={3} value={edit.bio} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} /></Field>
            <Field label="Photo">
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
                      className="h-48 w-full object-cover rounded-full mx-auto"
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
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => { setEdit(null); setSelectedFile(null); setPreviewImage(null); }} disabled={uploading}>Cancel</Button><Button type="submit" disabled={uploading}>{uploading ? 'Saving...' : 'Save'}</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={handleDeleteConfirmed} message="Remove this team member?" />
    </AdminShell>
  );
}
