import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { useAdminCollection, uid, type Project } from "@/lib/admin-store";
import { Plus, Pencil, Trash2 } from "lucide-react";

const CATS = ["Government", "Residential", "Industrial", "Commercial"] as const;

export default function AdminProjectsPage() {
  const [items, setItems] = useAdminCollection("projects");
  const [edit, setEdit] = useState<Project | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const blank = (): Project => ({ id: uid(), title: "", category: "Commercial", location: "", description: "" });
  const save = (p: Project) => {
    setItems(items.some((i) => i.id === p.id) ? items.map((i) => (i.id === p.id ? p : i)) : [p, ...items]);
    setEdit(null);
  };

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <AdminShell title="Manage Projects">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...CATS].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === c ? "bg-aqua text-aqua-foreground" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{c}</button>
          ))}
        </div>
        <Button onClick={() => setEdit(blank())}><Plus className="h-4 w-4" /> Add Project</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            {p.image && <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />}
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-aqua-foreground">{p.category}</span>
              <h3 className="mt-1 font-display font-bold">{p.title}</h3>
              <p className="text-xs text-slate-500">{p.location}</p>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{p.description}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => setEdit(p)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="danger" onClick={() => setDel(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && items.some((i) => i.id === edit.id) ? "Edit Project" : "Add Project"}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Title"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required /></Field>
            <Field label="Category"><Select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as typeof edit.category })}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Location"><Input value={edit.location} onChange={(e) => setEdit({ ...edit, location: e.target.value })} required /></Field>
            <Field label="Description"><Textarea rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} required /></Field>
            <Field label="Image URL"><Input value={edit.image ?? ""} onChange={(e) => setEdit({ ...edit, image: e.target.value })} placeholder="https://…" /></Field>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Delete this project?" />
    </AdminShell>
  );
}
