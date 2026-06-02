import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Confirm } from "@/components/admin/ui";
import { useAdminCollection } from "@/lib/admin-store";
import { Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminLeadsPage() {
  const [items, setItems] = useAdminCollection("leads");
  const [del, setDel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? items : items.filter((l) => l.status === filter);
  const updateStatus = (id: string, status: "new" | "contacted" | "closed") => {
    setItems(items.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <AdminShell title="Contact Leads">
      <div className="flex gap-1.5 mb-4">
        {["all", "new", "contacted", "closed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${filter === s ? "bg-aqua text-aqua-foreground" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 && <Card className="p-12 text-center text-slate-500">No leads yet. Submit the website contact form to see entries here.</Card>}

      <div className="space-y-3">
        {filtered.map((l) => (
          <Card key={l.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold">{l.name}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${l.status === "new" ? "bg-amber-100 text-amber-700" : l.status === "contacted" ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>{l.status}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{new Date(l.createdAt).toLocaleString()}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
                  <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 hover:text-aqua-foreground"><Mail className="h-3.5 w-3.5" /> {l.email}</a>
                  <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1.5 hover:text-aqua-foreground"><Phone className="h-3.5 w-3.5" /> {l.phone}</a>
                  {l.company && <span>· {l.company}</span>}
                </div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-aqua-foreground">{l.service}</div>
                <p className="mt-2 text-sm text-slate-600">{l.message}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {l.status !== "contacted" && <Button variant="secondary" onClick={() => updateStatus(l.id, "contacted")}><CheckCircle2 className="h-3.5 w-3.5" /> Mark Contacted</Button>}
                {l.status !== "closed" && <Button variant="secondary" onClick={() => updateStatus(l.id, "closed")}>Close</Button>}
                <Button variant="danger" onClick={() => setDel(l.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Delete this inquiry?" />
    </AdminShell>
  );
}
