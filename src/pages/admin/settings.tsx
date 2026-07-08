import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea } from "@/components/admin/ui";
import { Save, Loader2 } from "lucide-react";

type Settings = {
  companyName: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  heroTitle: string;
  heroSubtitle: string;
  footerNote: string;
  seoTitle: string;
  seoDescription: string;
};

const defaultSettings: Settings = {
  companyName: "KHM Infra Innovations Private Limited",
  tagline: "Sustainable waste water engineering",
  address: "Office No. St-1B, Stilt Floor, Axis Business Centre, Near Marigold Banquets, Bhugaon – 412115, Maharashtra, India",
  email: "khminfrainnovations@gmail.com",
  phone: "+91 9028716090, 9511785597",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  heroTitle: "Engineering Water for a Sustainable Tomorrow",
  heroSubtitle: "Turnkey waste water management for buildings, industry & smart cities.",
  footerNote: "Engineered with care for a sustainable tomorrow.",
  seoTitle: "KHM Infra Innovations | Waste Water Management",
  seoDescription: "Advanced sewage and effluent treatment, water recycling, and smart water infrastructure.",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [draft, setDraft] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
        setDraft(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof draft, v: string) => setDraft({ ...draft, [k]: v });

  if (loading) {
    return (
      <AdminShell title="Website Settings">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#1a5276]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Website Settings">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
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
          <Field label="LinkedIn"><Input value={draft.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></Field>
          <Field label="Instagram"><Input value={draft.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
          <Field label="YouTube"><Input value={draft.youtube} onChange={(e) => set("youtube", e.target.value)} /></Field>
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
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
