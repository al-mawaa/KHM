import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Modal, Confirm } from "@/components/admin/ui";
import { useAdminCollection, uid, type TeamMember } from "@/lib/admin-store";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminTeamPage() {
  const [items, setItems] = useAdminCollection("team");
  const [edit, setEdit] = useState<TeamMember | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const blank = (): TeamMember => ({ id: uid(), name: "", role: "", bio: "" });
  const save = (t: TeamMember) => {
    setItems(items.some((i) => i.id === t.id) ? items.map((i) => (i.id === t.id ? t : i)) : [t, ...items]);
    setEdit(null);
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
              <Button variant="secondary" onClick={() => setEdit(t)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
              <Button variant="danger" onClick={() => setDel(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Team Member">
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required /></Field>
            <Field label="Role"><Input value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} required /></Field>
            <Field label="Bio"><Textarea rows={3} value={edit.bio} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} /></Field>
            <Field label="Photo URL"><Input value={edit.image ?? ""} onChange={(e) => setEdit({ ...edit, image: e.target.value })} /></Field>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Remove this team member?" />
    </AdminShell>
  );
}
