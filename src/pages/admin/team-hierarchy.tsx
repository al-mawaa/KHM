import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Select, Modal, Confirm, Textarea } from "@/components/admin/ui";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  X,
  Users,
  Award,
  ShieldAlert,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  _id?: string;
  name: string;
  designation: string;
  role: "director" | "subdirector" | "employee";
  department?: string;
  remark?: string;
  parentId?: string | null;
  image?: string;
  imagePublicId?: string;
  order: number;
  isActive: boolean;
}

export default function AdminTeamHierarchyPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [edit, setEdit] = useState<TeamMember | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "director" | "subdirector" | "employee">("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.message || "Failed to fetch team members");
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const blank = (): TeamMember => ({
    name: "",
    designation: "",
    role: "employee",
    department: "",
    remark: "",
    parentId: null,
    image: "",
    imagePublicId: "",
    order: items.length + 1,
    isActive: true,
  });

  // ─── Stats Cards calculations ───
  const totalCount = items.length;
  const directorsCount = items.filter((i) => i.role === "director").length;
  const subDirectorsCount = items.filter((i) => i.role === "subdirector").length;
  const employeesCount = items.filter((i) => i.role === "employee").length;

  // ─── Drag & Drop Image Handlers ───
  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

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
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      setUploadProgress(90);
      const data = await res.json();
      setUploadProgress(100);

      if (data.success) {
        return { url: data.filePath, publicId: data.publicId };
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (publicId: string) => {
    try {
      if (!publicId) return;
      await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };

  // ─── CRUD Actions ───
  const save = async (m: TeamMember) => {
    try {
      setSaving(true);
      setError(null);

      let image = m.image;
      let imagePublicId = m.imagePublicId;
      const oldImagePublicId = edit?.imagePublicId;

      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          image = uploadResult.url;
          imagePublicId = uploadResult.publicId;
          toast.success("Image uploaded successfully to Cloudinary");
        } catch (error: any) {
          console.error("Upload error:", error);
          toast.error(error.message || "Failed to upload image");
          setSaving(false);
          return;
        }
      }

      // Clean up old image if a new image was uploaded and we're editing
      if (edit && oldImagePublicId && oldImagePublicId !== imagePublicId) {
        await deleteFile(oldImagePublicId);
      }

      const isEdit = !!m._id;
      const url = isEdit ? `/api/team/${m._id}` : "/api/team";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...m, image, imagePublicId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          isEdit ? "Team member updated successfully." : "Team member created successfully.",
        );
        await fetchTeam();
        setEdit(null);
        setSelectedFile(null);
        setPreviewImage(null);
      } else {
        setError(data.message || "Failed to save team member");
        toast.error(data.message || "Failed to save team member");
      }
    } catch (err) {
      console.error("Error saving team member:", err);
      setError("Failed to save team member");
      toast.error("Failed to save team member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Team member deleted successfully.");
        await fetchTeam();
        setDel(null);
      } else {
        setError(data.message || "Failed to delete team member");
        toast.error(data.message || "Failed to delete team member");
      }
    } catch (err) {
      console.error("Error deleting team member:", err);
      setError("Failed to delete team member");
      toast.error("Failed to delete team member");
    }
  };

  const filteredItems = filter === "all" ? items : items.filter((i) => i.role === filter);

  const initials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "director":
        return "bg-purple-100 text-purple-800";
      case "subdirector":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getParentName = (parentId?: string | null) => {
    if (!parentId) return "—";
    return items.find((i) => i._id === parentId)?.name || "—";
  };

  const formatRoleLabel = (role: string) => {
    switch (role) {
      case "director":
        return "Director";
      case "subdirector":
        return "Sub Director";
      case "employee":
        return "Employee";
      default:
        return role;
    }
  };

  return (
    <AdminShell title="Team Hierarchy Management">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-5 flex items-center gap-4">
          <div className="rounded-full bg-slate-100 p-3 text-[#1a5276]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalCount}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Members
            </div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="rounded-full bg-purple-50 p-3 text-purple-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{directorsCount}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Directors
            </div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="rounded-full bg-blue-50 p-3 text-blue-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{subDirectorsCount}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Sub Directors
            </div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="rounded-full bg-green-50 p-3 text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{employeesCount}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Employees
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "director", "subdirector", "employee"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                filter === t
                  ? "bg-aqua text-aqua-foreground"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All Roles" : formatRoleLabel(t)}
            </button>
          ))}
        </div>
        <Button
          onClick={() => {
            setEdit(blank());
            setPreviewImage(null);
            setSelectedFile(null);
          }}
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-[#1a5276]" /> Loading team tree members...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
          No team members found for the selected filter. Click "Add Team Member" to add one.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Photo</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Reports To</th>
                  <th className="px-6 py-4 text-center">Order</th>
                  <th className="px-6 py-4 text-center">Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredItems.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#1a5276] text-white flex items-center justify-center font-bold text-sm">
                          {initials(m.name)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">
                      {m.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{m.designation}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {m.department || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {getParentName(m.parentId)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium whitespace-nowrap">
                      {m.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-full h-6 w-6 ${m.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}
                        >
                          {m.isActive ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEdit(m);
                            setSelectedFile(null);
                            setPreviewImage(m.image || null);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="danger" onClick={() => setDel(m._id!)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Create/Edit */}
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
              <Field label="Name (required)">
                <Input
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                  required
                  placeholder="e.g. John Doe"
                />
              </Field>
              <Field label="Designation (required)">
                <Input
                  value={edit.designation}
                  onChange={(e) => setEdit({ ...edit, designation: e.target.value })}
                  required
                  placeholder="e.g. Director of Operations"
                />
              </Field>
            </div>

            <Field label="Department (optional)">
              <Input
                value={edit.department || ""}
                onChange={(e) => setEdit({ ...edit, department: e.target.value })}
                placeholder="e.g. Engineering, HR"
              />
            </Field>

            <Field label="Reports To (optional)">
              <Select
                value={edit.parentId || ""}
                onChange={(e) =>
                  setEdit({ ...edit, parentId: e.target.value ? e.target.value : null })
                }
              >
                <option value="">No parent — top level</option>
                {items
                  .filter((m) => m._id !== edit._id)
                  .map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} — {m.designation}
                    </option>
                  ))}
              </Select>
            </Field>

            <Field label="Message (shown when user clicks member on About page)">
              <Textarea
                rows={4}
                value={edit.remark || ""}
                onChange={(e) => setEdit({ ...edit, remark: e.target.value })}
                placeholder="Role details, responsibilities, experience..."
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <Field label="Order number (for sorting)">
                <Input
                  type="number"
                  min={0}
                  value={edit.order}
                  onChange={(e) => setEdit({ ...edit, order: Number(e.target.value) })}
                />
              </Field>
              <div className="flex items-center gap-2 mt-4 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={edit.isActive}
                  onChange={(e) => setEdit({ ...edit, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-aqua focus:ring-aqua"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-slate-700 select-none"
                >
                  Active Team Member
                </label>
              </div>
            </div>

            {/* Photo Upload Zone */}
            <Field label="Profile Image">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  selectedFile || previewImage
                    ? "border-slate-350 bg-slate-50"
                    : "border-slate-300 hover:border-aqua hover:bg-slate-50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {uploading ? (
                  <div className="space-y-3">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-aqua" />
                    <p className="text-sm text-slate-600">Uploading image… {uploadProgress}%</p>
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
                        JPG, JPEG, PNG, or WebP (max 10MB)
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

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
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
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : edit._id ? (
                  "Update Member"
                ) : (
                  "Create Member"
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => handleDelete(del!)}
        message="Are you sure you want to delete this team member? This action will also remove their profile picture from Cloudinary."
      />
    </AdminShell>
  );
}
