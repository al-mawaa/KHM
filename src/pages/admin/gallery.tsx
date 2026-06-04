import { useState, useRef, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { Upload, Trash2, Pencil } from "lucide-react";

const CATEGORIES = ["Infrastructure", "Festivals", "Projects", "Team", "Events"] as const;

interface GalleryItem {
  _id?: string;
  title: string;
  category: string;
  image: string;
  albumName: string;
  description: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [album, setAlbum] = useState("Projects");
  const [del, setDel] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState<GalleryItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      console.log('Fetching gallery items from API...');
      setLoading(true);
      setError(null);
      const res = await fetch('/api/gallery');
      const data = await res.json();
      console.log('Admin Gallery Data:', data);
      
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setError('Failed to fetch gallery items: Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    
    console.log('Processing files:', files.length);
    
    // Save each image to MongoDB
    for (const file of Array.from(files).slice(0, 12)) {
      try {
        console.log('Uploading file:', file.name);
        
        // Upload file first
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) {
          console.error('Upload failed:', uploadData.message);
          continue;
        }
        
        console.log('File uploaded successfully:', uploadData.filePath);
        
        // Save gallery item with file path
        const galleryItem = {
          title: file.name.split('.')[0],
          category: album,
          image: uploadData.filePath,
          albumName: album,
          description: ''
        };
        
        console.log('Saving gallery item:', galleryItem);
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryItem),
        });
        const data = await res.json();
        console.log('Save response:', data);
        console.log('Uploaded File Path:', uploadData.filePath);
      } catch (err) {
        console.error('Error saving gallery item:', err);
      }
    }
    
    await fetchGallery();
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting gallery item:', id);
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      console.log('Delete response:', data);
      
      await fetchGallery();
      setDel(null);
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      setError('Failed to delete gallery item');
    }
  };

  const handleEdit = async (item: GalleryItem) => {
    try {
      console.log('Updating gallery item:', item);
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      
      const data = await res.json();
      console.log('Update response:', data);
      
      await fetchGallery();
      setEdit(null);
    } catch (err) {
      console.error('Error updating gallery item:', err);
      setError('Failed to update gallery item');
    }
  };

  const albums = Array.from(new Set(items.map((i) => i.albumName)));

  return (
    <AdminShell title="Manage Gallery">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <Card className="p-5 mb-6">
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <Field label="Album name"><Input value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="e.g. Projects, Plants, Team" /></Field>
          <Button onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Upload Images</Button>
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*" hidden onChange={(e) => handleFiles(e.target.files)} />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`mt-4 rounded-xl border-2 border-dashed p-10 text-center text-sm transition-colors ${dragOver ? "border-aqua bg-aqua/5" : "border-slate-300 text-slate-500"}`}
        >
          Drag & drop images here to add to <strong>{album}</strong>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading gallery...</div>
      ) : albums.length === 0 ? (
        <p className="text-center text-slate-500 py-12">No gallery images found — upload images to get started.</p>
      ) : (
        albums.map((a) => (
          <div key={a} className="mb-8">
            <h3 className="font-display font-bold mb-3">{a} <span className="text-sm text-slate-500">({items.filter((i) => i.albumName === a).length})</span></h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.filter((i) => i.albumName === a).map((g) => (
                <div key={g._id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img src={g.image} alt={g.title} className="h-full w-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEdit(g)} className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500 text-white">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDel(g._id!)} className="grid h-8 w-8 place-items-center rounded-lg bg-red-500 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => handleDelete(del!)} message="Delete this image?" />

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit Gallery Item">
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); handleEdit(edit); }} className="space-y-4">
            <Field label="Title"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required /></Field>
            <Field label="Category"><Select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as typeof edit.category })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Album Name"><Input value={edit.albumName} onChange={(e) => setEdit({ ...edit, albumName: e.target.value })} required /></Field>
            <Field label="Description"><Textarea rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <Field label="Image URL"><Input value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} required /></Field>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
    </AdminShell>
  );
}
