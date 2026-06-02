import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Modal, Confirm } from "@/components/admin/ui";
import { useAdminCollection, uid, type Service } from "@/lib/admin-store";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminServicesPage() {
  const [items, setItems] = useAdminCollection("services");
  const [edit, setEdit] = useState<Service | null>(null);
  const [del, setDel] = useState<string | null>(null);

  const blank = (): Service => ({ id: uid(), title: "", icon: "Droplets", description: "" });
  const save = (s: Service) => {
    setItems(items.some((i) => i.id === s.id) ? items.map((i) => (i.id === s.id ? s : i)) : [s, ...items]);
    setEdit(null);
  };

  return (
    <AdminShell title="Manage Services">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setEdit(blank())}><Plus className="h-4 w-4" /> Add Service</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Card key={s.id} className="p-5">
            {s.image && <img src={s.image} alt={s.title} className="mb-3 h-32 w-full object-cover rounded-lg" />}
            <div className="text-[10px] uppercase tracking-wider font-bold text-aqua-foreground">{s.icon}</div>
            <h3 className="mt-1 font-display font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600 line-clamp-3">{s.description}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => setEdit(s)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
              <Button variant="danger" onClick={() => setDel(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && items.some((i) => i.id === edit.id) ? "Edit Service" : "Add Service"}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Title"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required /></Field>
            <Field label="Icon (lucide name)"><Input value={edit.icon} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} required /></Field>
            <Field label="Image URL (optional)"><Input value={edit.image ?? ""} onChange={(e) => setEdit({ ...edit, image: e.target.value })} placeholder="https://…" /></Field>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Delete this service?" />
    </AdminShell>
  );
}
