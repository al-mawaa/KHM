import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Mail, MapPin, Phone, Send, FileBadge, MessageCircle, Building2, Loader2 } from "lucide-react";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

function getPhoneNumbers(phone: string) {
  const numbers = phone.split(",").map(p => p.trim());
  return numbers.map(n => ({
    display: n,
    tel: n.replace(/\D/g, ""),
  }));
}

function getMapsEmbedUrl(address: string) {
  const encoded = encodeURIComponent(address);
  return `https://www.google.com/maps?q=${encoded}&output=embed`;
}

export default function ContactPage() {
  useVisitorTracking('Contact');
  
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useWebsiteSettings();
  const phones = getPhoneNumbers(settings.phone);
  const whatsappUrl = `https://wa.me/${settings.phone.replace(/\D/g, "").slice(0, 10)}`;
  const mapsEmbedUrl = getMapsEmbedUrl(settings.address);

  return (
    <>
      <PageHero title="Let's engineer your project" subtitle="Tell us about your site and goals — we'll respond within one business day." backgroundImage="/images/hero-plant.jpg" />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-7 sm:p-10 shadow-card">
            <SectionHeader align="left" eyebrow="Request Consultation" title="Send us a message" />
            {sent ? (
              <div className="mt-8 rounded-2xl border border-eco/40 bg-eco/10 p-6 text-center">
                <div className="text-2xl">🌊</div>
                <h3 className="mt-2 font-display text-lg font-semibold">Thank you!</h3>
                <p className="text-sm text-muted-foreground mt-1">Your enquiry has been received. We'll be in touch shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  setError(null);
                  
                  try {
                    const fd = new FormData(e.currentTarget);
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: String(fd.get("name") ?? ""),
                        phone: String(fd.get("phone") ?? ""),
                        email: String(fd.get("email") ?? ""),
                        company: String(fd.get("company") ?? ""),
                        service: String(fd.get("service") ?? ""),
                        message: String(fd.get("message") ?? ""),
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.message || 'Failed to submit form');
                    }

                    setSent(true);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                    console.error('Form submission error:', err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="mt-8 grid sm:grid-cols-2 gap-4"
              >
                {[
                  { n: "name", l: "Full Name", t: "text" },
                  { n: "phone", l: "Phone", t: "tel" },
                  { n: "email", l: "Email", t: "email" },
                  { n: "company", l: "Company", t: "text" },
                ].map((f) => (
                  <div key={f.n}>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.l}</label>
                    <input
                      type={f.t} name={f.n} required maxLength={120}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-aqua"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Required</label>
                  <select name="service" required className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-aqua">
                    {["Sewage Treatment Plant","Effluent Treatment Plant","Water Recycling","Rain Water Harvesting","AMC & Maintenance","Consultancy","Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea name="message" rows={5} required maxLength={1000} className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-aqua resize-none" />
                </div>
                {error && (
                  <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-aqua px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Enquiry <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {[
              { I: MapPin, t: "Office", d: settings.address },
              { I: FileBadge, t: "CIN", d: "U71100PN2026PTC255526" },
              ...phones.map((phone) => ({
                I: Phone,
                t: "Phone",
                d: phone.display,
                href: `tel:${phone.tel}`,
              })),
              { I: Mail, t: "Email", d: settings.email, href: `mailto:${settings.email}` },
              { I: Building2, t: "Industry", d: "Architectural & Engineering Activities · Waste Water Management" },
            ].map((c) => (
              <div key={`${c.t}-${c.d}`} className="rounded-2xl border border-border bg-card p-5 shadow-card hover-lift">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-aqua text-primary-foreground shrink-0">
                    <c.I className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.t}</div>
                    {"href" in c && c.href ? (
                      <a href={c.href} className="mt-0.5 font-semibold text-foreground hover:text-aqua-foreground transition-colors">{c.d}</a>
                    ) : (
                      <div className="mt-0.5 font-medium text-foreground">{c.d}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <a
              href={whatsappUrl}
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-eco text-primary-foreground py-4 font-semibold shadow-elegant hover-lift"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="overflow-hidden rounded-3xl shadow-elegant border border-border">
            <iframe
              title="KHM Infra Office Location"
              src={mapsEmbedUrl}
              className="w-full h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
