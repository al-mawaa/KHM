import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Confirm } from "@/components/admin/ui";
import { Mail, Phone, Trash2, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

type LeadStatus = "new" | "contacted" | "closed";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [del, setDel] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Fetch leads from MongoDB via API ──────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success) {
        setLeads(json.data);
      } else {
        setError(json.message || "Failed to fetch leads");
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Network error — could not load leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ── Update status in MongoDB ───────────────────────────────────────────────
  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/leads?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      } else {
        alert("Failed to update status: " + json.message);
      }
    } catch (err) {
      alert("Network error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Delete from MongoDB ────────────────────────────────────────────────────
  const deleteLead = async () => {
    if (!del) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads?id=${del}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.filter((l) => l.id !== del));
      } else {
        alert("Failed to delete: " + json.message);
      }
    } catch (err) {
      alert("Network error deleting lead.");
    } finally {
      setDeleting(false);
      setDel(null);
    }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <AdminShell title="Contact Leads">
      {/* Filter tabs + refresh */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {["all", "new", "contacted", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === s
                  ? "bg-aqua text-aqua-foreground"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s}
              {s !== "all" && (
                <span className="ml-1 opacity-60">
                  ({leads.filter((l) => l.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading leads from database…
        </div>
      )}

      {error && !loading && (
        <Card className="p-6 text-center text-red-600 border border-red-200 bg-red-50">
          <p className="font-semibold">Error loading leads</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchLeads}
            className="mt-3 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card className="p-12 text-center text-slate-500">
          {filter === "all"
            ? "No leads yet. Submit the website contact form to see entries here."
            : `No leads with status "${filter}".`}
        </Card>
      )}

      {/* Leads list */}
      {!loading && !error && (
        <div className="space-y-3">
          {filtered.map((l) => (
            <Card key={l.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold">{l.name}</h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        l.status === "new"
                          ? "bg-amber-100 text-amber-700"
                          : l.status === "contacted"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {new Date(l.createdAt).toLocaleString()}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
                    <a
                      href={`mailto:${l.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-aqua-foreground"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {l.email}
                    </a>
                    <a
                      href={`tel:${l.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-aqua-foreground"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {l.phone}
                    </a>
                    {l.company && <span>· {l.company}</span>}
                  </div>

                  <div className="mt-2 text-xs font-bold uppercase tracking-wider text-aqua-foreground">
                    {l.service}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{l.message}</p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {l.status !== "contacted" && (
                    <Button
                      variant="secondary"
                      onClick={() => updateStatus(l.id, "contacted")}
                      disabled={updatingId === l.id}
                    >
                      {updatingId === l.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Mark Contacted
                    </Button>
                  )}
                  {l.status !== "closed" && (
                    <Button
                      variant="secondary"
                      onClick={() => updateStatus(l.id, "closed")}
                      disabled={updatingId === l.id}
                    >
                      Close
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => setDel(l.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={deleteLead}
        message="Delete this inquiry permanently from the database?"
      />
    </AdminShell>
  );
}
