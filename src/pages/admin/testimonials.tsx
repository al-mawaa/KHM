import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { useAdminCollection, uid, type Testimonial } from "@/lib/admin-store";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useAdminCollection("testimonials");
  const [edit, setEdit] = useState<Testimonial | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const blank = (): Testimonial => ({ id: uid(), name: "", role: "", quote: "", rating: 5 });
  const save = (t: Testimonial) => {
    setItems(items.some((i) => i.id === t.id) ? items.map((i) => (i.id === t.id ? t : i)) : [t, ...items]);
    setEdit(null);
  };
  return (
    <AdminShell title="Manage Testimonials">
      <div className="flex justify-end mb-4"><Button onClick={() => setEdit(blank())}><Plus className="h-4 w-4" /> Add</Button></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex gap-0.5 text-amber-500">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
            <p className="mt-2 text-sm italic text-slate-700">"{t.quote}"</p>
            <div className="mt-3 text-sm font-semibold">{t.name}</div>
            <div className="text-xs text-slate-500">{t.role}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => setEdit(t)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
              <Button variant="danger" onClick={() => setDel(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Testimonial">
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required /></Field>
            <Field label="Role"><Input value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} /></Field>
            <Field label="Quote"><Textarea rows={3} value={edit.quote} onChange={(e) => setEdit({ ...edit, quote: e.target.value })} required /></Field>
            <Field label="Rating"><Select value={edit.rating} onChange={(e) => setEdit({ ...edit, rating: Number(e.target.value) })}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</Select></Field>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Delete this testimonial?" />
    </AdminShell>
  );
}
