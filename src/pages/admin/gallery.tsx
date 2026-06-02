import { useState, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Confirm } from "@/components/admin/ui";
import { useAdminCollection, uid } from "@/lib/admin-store";
import { Upload, Trash2 } from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useAdminCollection("gallery");
  const [album, setAlbum] = useState("Projects");
  const [del, setDel] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const toAdd = await Promise.all(
      Array.from(files).slice(0, 12).map(
        (f) => new Promise<{ id: string; album: string; caption: string; image: string }>((res) => {
          const r = new FileReader();
          r.onload = () => res({ id: uid(), album, caption: f.name, image: r.result as string });
          r.readAsDataURL(f);
        })
      )
    );
    setItems([...toAdd, ...items]);
  };

  const albums = Array.from(new Set(items.map((i) => i.album)));

  return (
    <AdminShell title="Manage Gallery">
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

      {albums.length === 0 && <p className="text-center text-slate-500 py-12">No images yet — upload to get started.</p>}

      {albums.map((a) => (
        <div key={a} className="mb-8">
          <h3 className="font-display font-bold mb-3">{a} <span className="text-sm text-slate-500">({items.filter((i) => i.album === a).length})</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.filter((i) => i.album === a).map((g) => (
              <div key={g.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img src={g.image} alt={g.caption} className="h-full w-full object-cover" />
                <button onClick={() => setDel(g.id)} className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Delete this image?" />
    </AdminShell>
  );
}
