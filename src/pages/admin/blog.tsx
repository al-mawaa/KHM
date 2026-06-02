import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Modal, Confirm } from "@/components/admin/ui";
import { useAdminCollection, uid, type BlogPost } from "@/lib/admin-store";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminBlogPage() {
  const [items, setItems] = useAdminCollection("blog");
  const [edit, setEdit] = useState<BlogPost | null>(null);
  const [del, setDel] = useState<string | null>(null);

  const blank = (): BlogPost => ({ id: uid(), title: "", slug: "", excerpt: "", content: "", tags: "", createdAt: Date.now() });
  const save = (p: BlogPost) => {
    const next = { ...p, slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") };
    setItems(items.some((i) => i.id === p.id) ? items.map((i) => (i.id === p.id ? next : i)) : [next, ...items]);
    setEdit(null);
  };

  return (
    <AdminShell title="Manage Blog">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setEdit(blank())}><Plus className="h-4 w-4" /> New Post</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-semibold">{p.title}<div className="text-xs text-slate-500">/{p.slug}</div></td>
                  <td className="px-5 py-3 text-slate-600">{p.tags}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="secondary" onClick={() => setEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="danger" onClick={() => setDel(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="text-center text-slate-500 py-10">No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && items.some((i) => i.id === edit.id) ? "Edit Post" : "New Post"}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Title"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required /></Field>
            <Field label="Slug (optional)"><Input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} placeholder="auto-generated" /></Field>
            <Field label="Excerpt"><Textarea rows={2} value={edit.excerpt} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} /></Field>
            <Field label="Content"><Textarea rows={8} value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} /></Field>
            <Field label="Featured Image URL"><Input value={edit.image ?? ""} onChange={(e) => setEdit({ ...edit, image: e.target.value })} /></Field>
            <Field label="Tags (comma separated)"><Input value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="SEO Title"><Input value={edit.seoTitle ?? ""} onChange={(e) => setEdit({ ...edit, seoTitle: e.target.value })} /></Field>
              <Field label="SEO Description"><Input value={edit.seoDescription ?? ""} onChange={(e) => setEdit({ ...edit, seoDescription: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" type="button" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        )}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => setItems(items.filter((i) => i.id !== del))} message="Delete this post?" />
    </AdminShell>
  );
}
