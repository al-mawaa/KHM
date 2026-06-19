import { useState, useEffect, useCallback, type ComponentType } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Confirm, Modal, Field, Textarea, Select } from "@/components/admin/ui";
import {
  Mail,
  Phone,
  Trash2,
  Loader2,
  RefreshCw,
  MessageSquare,
  Briefcase,
  MapPin,
  Clock,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

type EnquiryStatus = "new" | "reviewed" | "contacted" | "closed";

interface JobEnquiry {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentInterested: string;
  totalExperience?: string;
  currentLocation?: string;
  message: string;
  resumeUrl?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  closed: "Closed",
};

export default function AdminJobEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<JobEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [del, setDel] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<JobEnquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/careers/enquiries${params}`);
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data);
      } else {
        toast.error(data.message || "Failed to fetch enquiries");
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id: string, status: EnquiryStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/careers/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
        if (selected?._id === id) setSelected({ ...selected, status });
        toast.success("Status updated");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/careers/enquiries/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === selected._id ? { ...e, adminNotes } : e))
        );
        setSelected({ ...selected, adminNotes });
        toast.success("Notes saved");
      } else {
        toast.error(data.message || "Failed to save notes");
      }
    } catch {
      toast.error("Failed to save notes");
    }
  };

  const deleteEnquiry = async () => {
    if (!del) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/careers/enquiries/${del}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== del));
        if (selected?._id === del) setSelected(null);
        toast.success("Enquiry deleted");
        setDel(null);
      } else {
        toast.error(data.message || "Failed to delete enquiry");
      }
    } catch {
      toast.error("Failed to delete enquiry");
    } finally {
      setDeleting(false);
    }
  };

  const openDetails = (enquiry: JobEnquiry) => {
    setSelected(enquiry);
    setAdminNotes(enquiry.adminNotes || "");
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AdminShell title="Job Enquiries">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "reviewed", "contacted", "closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                filter === s
                  ? "bg-aqua text-aqua-foreground"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={fetchEnquiries}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : enquiries.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">No job enquiries found.</Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Department / Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">{enquiry.fullName}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-1 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {enquiry.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {enquiry.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{enquiry.departmentInterested}</td>
                  <td className="px-5 py-4">
                    <select
                      value={enquiry.status}
                      disabled={updatingId === enquiry._id}
                      onChange={(e) => updateStatus(enquiry._id, e.target.value as EnquiryStatus)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium"
                    >
                      {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{formatDate(enquiry.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => openDetails(enquiry)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                      <Button variant="danger" onClick={() => setDel(enquiry._id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Job Enquiry Details"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Full Name" value={selected.fullName} icon={Briefcase} />
              <Detail label="Email" value={selected.email} icon={Mail} />
              <Detail label="Phone" value={selected.phoneNumber} icon={Phone} />
              <Detail label="Department / Role" value={selected.departmentInterested} icon={Briefcase} />
              <Detail label="Experience" value={selected.totalExperience || "—"} icon={Clock} />
              <Detail label="Location" value={selected.currentLocation || "—"} icon={MapPin} />
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                {selected.message}
              </p>
            </div>

            {selected.resumeUrl && (
              <a
                href={selected.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-aqua-foreground hover:underline"
              >
                <FileText className="h-4 w-4" />
                View Resume
              </a>
            )}

            <Field label="Admin Notes">
              <Textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this enquiry..."
              />
            </Field>

            <Field label="Status">
              <Select
                value={selected.status}
                onChange={(e) => updateStatus(selected._id, e.target.value as EnquiryStatus)}
              >
                {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button onClick={saveNotes}>
                <MessageSquare className="h-4 w-4" /> Save Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={deleteEnquiry}
        message="Delete this job enquiry?"
      />
    </AdminShell>
  );
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
