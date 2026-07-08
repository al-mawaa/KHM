import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

export default function MediaPage() {
  useVisitorTracking("Media");
  const { settings } = useWebsiteSettings();

  const linkedin = settings.linkedin || "https://www.linkedin.com";
  const instagram = settings.instagram || "https://www.instagram.com";
  const youtube = settings.youtube || "";

  const phone = settings.phone || "";
  const phoneClean = phone.replace(/\D/g, "").slice(0, 15);
  const whatsapp = `https://wa.me/${phoneClean}`;

  return (
    <>
      <PageHero
        title="Explore Our Media"
        subtitle="Follow us on social platforms"
        breadcrumb="Media"
        backgroundImage="/images/hero-plant.jpg"
      />

      <section className="py-16 bg-linear-to-b from-[#e8f4fb] via-[#f4fbf5] to-[#ffffff]">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#1a5276]/80 mb-3">Media</p>
            <h2 className="text-4xl font-bold text-[#1a5276] sm:text-5xl">Explore our Media and all</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Connect with KHM Infra Innovations across our social channels for updates, insights, and company highlights.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#f2fbff] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#1a5276]/20 bg-[#1a5276]/10 text-[#1a5276] shadow-sm transition duration-300 group-hover:scale-110">
                  <Linkedin className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">LinkedIn</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">Follow our official LinkedIn page for timely company updates and published posts.</p>
              </div>
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#fff7f8] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <Instagram className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">Instagram</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">View our latest projects and company moments on Instagram.</p>
              </div>
            </a>

            <a
              href={youtube || "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#fff7f7] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500 text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <Youtube className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">YouTube</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{youtube ? "Subscribe to our channel for videos and updates." : "YouTube channel coming soon."}</p>
              </div>
            </a>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#f1fff3] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#25D366] text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">WhatsApp</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">Join our WhatsApp channel for fast updates and direct company contact.</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
