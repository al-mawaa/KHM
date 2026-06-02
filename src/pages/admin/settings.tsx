import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea } from "@/components/admin/ui";
import { useAdminCollection } from "@/lib/admin-store";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useAdminCollection("settings");
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k: keyof typeof draft, v: string) => setDraft({ ...draft, [k]: v });

  return (
    <AdminShell title="Website Settings">
      <form onSubmit={save} className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Company Information</h3>
          <Field label="Company Name"><Input value={draft.companyName} onChange={(e) => set("companyName", e.target.value)} /></Field>
          <Field label="Tagline"><Input value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="Address"><Textarea rows={3} value={draft.address} onChange={(e) => set("address", e.target.value)} /></Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Contact Details</h3>
          <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Phone"><Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Social Links</h3>
          <Field label="Facebook"><Input value={draft.facebook} onChange={(e) => set("facebook", e.target.value)} /></Field>
          <Field label="LinkedIn"><Input value={draft.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></Field>
          <Field label="Twitter / X"><Input value={draft.twitter} onChange={(e) => set("twitter", e.target.value)} /></Field>
          <Field label="Instagram"><Input value={draft.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Hero & Footer</h3>
          <Field label="Hero Title"><Input value={draft.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></Field>
          <Field label="Hero Subtitle"><Textarea rows={2} value={draft.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} /></Field>
          <Field label="Footer Note"><Input value={draft.footerNote} onChange={(e) => set("footerNote", e.target.value)} /></Field>
        </Card>

        <Card className="p-6 space-y-4 lg:col-span-2">
          <h3 className="font-display font-bold">SEO Settings</h3>
          <Field label="SEO Title"><Input value={draft.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></Field>
          <Field label="SEO Description"><Textarea rows={3} value={draft.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} /></Field>
        </Card>

        <div className="lg:col-span-2 flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-emerald-600 font-semibold">✓ Settings saved</span>}
          <Button type="submit"><Save className="h-4 w-4" /> Save Changes</Button>
        </div>
      </form>
    </AdminShell>
  );
}
