import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  Card,
  Button,
  Field,
  Input,
  Textarea,
  Select,
  Modal,
  Confirm,
} from "@/components/admin/ui";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  X,
  Search,
  Linkedin,
  Mail,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminCollection } from "@/lib/admin-store";

interface TeamMember {
  _id?: string;
  fullName: string;
  designation: string;
  profileImage?: string;
  profileImagePublicId?: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
  displayOrder: number;
  status: "Active" | "Inactive";
  createdAt?: string;
  isDirector?: boolean;
}

const STATUS_OPTIONS = ["Active", "Inactive"] as const;
const ITEMS_PER_PAGE = 10;

export default function AdminTeamPage() {
  const [rawItems, setRawItems] = useAdminCollection("team") as unknown as [
    any[],
    (val: any[]) => void,
  ];
  const [edit, setEdit] = useState<TeamMember | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = (rawItems || []).map((m: any) => ({
    _id: m._id || m.id || "",
    fullName: m.fullName || m.name || "",
    designation: m.designation || m.role || "",
    profileImage: m.profileImage || m.image || "",
    profileImagePublicId: m.profileImagePublicId || m.imagePublicId || "",
    bio: m.bio || "",
    linkedinUrl: m.linkedinUrl || "",
    email: m.email || "",
    displayOrder: m.displayOrder ?? m.order ?? 0,
    status: m.status || (m.isActive === false ? "Inactive" : "Active"),
    createdAt: m.createdAt || new Date().toISOString(),
    isDirector: m.isDirector || false,
  }));

  const blank = (): TeamMember => ({
    fullName: "",
    designation: "",
    profileImage: "",
    profileImagePublicId: "",
    bio: "",
    linkedinUrl: "",
    email: "",
    displayOrder: items.length,
    status: "Active",
    isDirector: false,
  });

  // ─── File Handling ─────────────────────────────────────────────────
  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(null);
      return;
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileSelect(e.target.files?.[0] || null);

  const uploadFile = async (file: File): Promise<{ url: string; publicId: string }> => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      setUploadProgress(30);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, fileName: file.name, mimeType: file.type }),
      });
      setUploadProgress(90);
      const data = await res.json();
      setUploadProgress(100);
      if (data.success) return { url: data.filePath, publicId: data.publicId };
      throw new Error(data.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteCloudinaryFile = async (publicId: string) => {
    if (!publicId) return;
    try {
      await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  // ─── CRUD ──────────────────────────────────────────────────────────
  const save = async (m: TeamMember) => {
    try {
      setSaving(true);
      setError(null);
      let profileImage = m.profileImage;
      let profileImagePublicId = m.profileImagePublicId;
      const oldPublicId = edit?.profileImagePublicId;

      if (selectedFile) {
        try {
          const result = await uploadFile(selectedFile);
          profileImage = result.url;
          profileImagePublicId = result.publicId;
        } catch {
          toast.error("Image upload failed.");
          setSaving(false);
          return;
        }
      }

      // Delete old Cloudinary image if replacing
      if (edit && oldPublicId && oldPublicId !== profileImagePublicId) {
        await deleteCloudinaryFile(oldPublicId);
      }

      const isEdit = !!m._id;
      let newItems = [...(rawItems || [])];

      const serializedMember = {
        id: m._id || (m as any).id || Math.random().toString(36).slice(2, 10),
        name: m.fullName || "",
        role: m.designation || "",
        bio: m.bio || "",
        image: profileImage || "",
        imagePublicId: profileImagePublicId || "",
        _id: m._id || (m as any).id || Math.random().toString(36).slice(2, 10),
        fullName: m.fullName || "",
        designation: m.designation || "",
        profileImage: profileImage || "",
        profileImagePublicId: profileImagePublicId || "",
        linkedinUrl: m.linkedinUrl || "",
        email: m.email || "",
        displayOrder: m.displayOrder ?? 0,
        status: m.status || "Active",
        createdAt: m.createdAt || new Date().toISOString(),
        isDirector: m.isDirector || false,
      };

      if (isEdit) {
        newItems = newItems.map((item) =>
          item._id === m._id || item.id === m._id ? serializedMember : item,
        );
        toast.success("Team member updated successfully.");
      } else {
        newItems.push(serializedMember);
        toast.success("Team member created successfully.");
      }

      setRawItems(newItems);
      setEdit(null);
      setSelectedFile(null);
      setPreviewImage(null);
    } catch {
      toast.error("Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const itemToDelete = (rawItems || []).find((item) => item._id === id || item.id === id);
      const publicId = itemToDelete?.profileImagePublicId || itemToDelete?.imagePublicId;
      if (publicId) {
        await deleteCloudinaryFile(publicId);
      }
      const newItems = (rawItems || []).filter((item) => item._id !== id && item.id !== id);
      setRawItems(newItems);
      toast.success("Team member deleted successfully.");
      setDel(null);
    } catch {
      toast.error("Failed to delete team member.");
    }
  };

  // ─── Filtering & Pagination ────────────────────────────────────────
  const filtered = items.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.designation.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPage(1);
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <AdminShell title="Manage Team Members">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or designation…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aqua/30 w-60"
            />
          </div>
          {/* Status filter pills */}
          <div className="flex gap-1.5">
            {(["All", "Active", "Inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-aqua text-aqua-foreground"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={() => setEdit(blank())}>
          <Plus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading team members…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          {items.length === 0
            ? 'No team members yet. Click "+ Add Member" to create one.'
            : "No members match your search or filter."}
          {(search || statusFilter !== "All") && (
            <button
              onClick={resetFilters}
              className="block mx-auto mt-2 text-aqua text-sm underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Designation</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Order</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {m.profileImage ? (
                          <img
                            src={m.profileImage}
                            alt={m.fullName}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-aqua grid place-items-center text-sm font-bold text-primary-foreground shrink-0">
                            {initials(m.fullName)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-800">{m.fullName}</div>
                          <div className="text-xs text-slate-500 md:hidden">{m.designation}</div>
                          <div className="flex gap-2 mt-0.5">
                            {m.linkedinUrl && (
                              <a
                                href={m.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#0077b5] hover:opacity-70"
                              >
                                <Linkedin className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {m.email && (
                              <a
                                href={`mailto:${m.email}`}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">
                      {m.designation}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-center">
                      {m.displayOrder}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          m.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEdit(m);
                            setSelectedFile(null);
                            setPreviewImage(m.profileImage || null);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="danger" onClick={() => setDel(m._id!)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
              <span>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`px-3 py-1 rounded border ${
                      n === page
                        ? "bg-aqua text-white border-aqua"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={!!edit}
        onClose={() => {
          setEdit(null);
          setSelectedFile(null);
          setPreviewImage(null);
        }}
        title={edit?._id ? "Edit Team Member" : "Add Team Member"}
      >
        {edit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save(edit);
            }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name">
                <Input
                  value={edit.fullName}
                  onChange={(e) => setEdit({ ...edit, fullName: e.target.value })}
                  required
                  placeholder="e.g. Hrishikesh Kaluskar"
                />
              </Field>
              <Field label="Designation">
                <Input
                  value={edit.designation || ""}
                  onChange={(e) => setEdit({ ...edit, designation: e.target.value })}
                  placeholder="e.g. Director & Co-Founder"
                />
              </Field>
            </div>

            <Field label="Show in Meet the Directors section">
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="checkbox"
                  checked={edit.isDirector || false}
                  onChange={(e) => setEdit({ ...edit, isDirector: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-aqua focus:ring-aqua"
                  id="isDirector"
                />
                <label htmlFor="isDirector" className="text-sm text-slate-700">
                  Yes, show this member as a Director on About page
                </label>
              </div>
            </Field>

            <Field label="Bio / Short Description">
              <Textarea
                rows={3}
                value={edit.bio}
                onChange={(e) => setEdit({ ...edit, bio: e.target.value })}
                placeholder="Brief professional background…"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="LinkedIn URL (optional)">
                <Input
                  value={edit.linkedinUrl}
                  onChange={(e) => setEdit({ ...edit, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/…"
                />
              </Field>
              <Field label="Email (optional)">
                <Input
                  type="email"
                  value={edit.email}
                  onChange={(e) => setEdit({ ...edit, email: e.target.value })}
                  placeholder="name@company.com"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Display Order">
                <Input
                  type="number"
                  min={0}
                  value={edit.displayOrder}
                  onChange={(e) => setEdit({ ...edit, displayOrder: Number(e.target.value) })}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={edit.status}
                  onChange={(e) =>
                    setEdit({ ...edit, status: e.target.value as "Active" | "Inactive" })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* Photo Upload */}
            <Field label="Profile Photo">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  selectedFile || previewImage
                    ? "border-slate-300 bg-slate-50"
                    : "border-slate-300 hover:border-aqua hover:bg-slate-50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {uploading ? (
                  <div className="space-y-3">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-aqua" />
                    <p className="text-sm text-slate-600">Uploading… {uploadProgress}%</p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-aqua h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : previewImage ? (
                  <div className="space-y-3">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-full mx-auto border-4 border-slate-200"
                    />
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X className="h-4 w-4" /> Remove
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" /> Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-10 w-10 mx-auto text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Drag and drop an image, or click to browse
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        JPG, JPEG, PNG, or WebP (max 5MB)
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setEdit(null);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving…" : edit._id ? "Update Member" : "Create Member"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => handleDelete(del!)}
        message="Are you sure you want to delete this team member? This action cannot be undone."
      />
    </AdminShell>
  );
}
