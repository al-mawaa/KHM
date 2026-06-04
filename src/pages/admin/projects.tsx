import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [edit, setEdit] = useState<Project | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    image: ""
  });

  const save = async (p: Project) => {
    try {
      console.log('Saving project:', p);
      const isEdit = !!p._id;
      const url = isEdit ? `/api/projects/${p._id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      
      const data = await res.json();
      console.log('Save response:', data);
      
      if (data.success) {
        await fetchProjects();
        setEdit(null);
      } else {
        setError(data.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting project:', id);
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      console.log('Delete response:', data);
      
      if (data.success) {
        await fetchProjects();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
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
                  <Button variant="secondary" onClick={() => setEdit(p)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="danger" onClick={() => setDel(p._id!)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && edit._id ? "Edit Project" : "Add Project"}>
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
            <Field label="Image URL"><Input value={edit.image ?? ""} onChange={(e) => setEdit({ ...edit, image: e.target.value })} placeholder="https://…" /></Field>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => handleDelete(del!)} message="Delete this project?" />
    </AdminShell>
  );
}
