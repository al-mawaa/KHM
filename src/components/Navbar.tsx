import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Twitter,
  X,
  Youtube,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrandLogoLink } from "@/components/BrandLogo";
import { addLead } from "@/lib/admin-store";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { cn } from "@/lib/utils";


function getSocialLinks(settings: ReturnType<typeof useWebsiteSettings>["settings"]) {
  const phoneClean = settings.phone.replace(/\D/g, "").slice(0, 10);
  const whatsappUrl = `https://wa.me/${phoneClean}`;

  return [
    { href: settings.facebook || "https://facebook.com", label: "Facebook", Icon: Facebook, className: "bg-[#1877F2] hover:bg-[#166fe0]" },
    { href: settings.twitter || "https://twitter.com", label: "Twitter", Icon: Twitter, className: "bg-[#1DA1F2] hover:bg-[#1a94df]" },
    { href: settings.linkedin || "https://linkedin.com", label: "LinkedIn", Icon: Linkedin, className: "bg-[#0A66C2] hover:bg-[#0958a8]" },
    {
      href: settings.instagram || "https://instagram.com",
      label: "Instagram",
      Icon: Instagram,
      className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    },
    { href: settings.youtube || "https://youtube.com", label: "YouTube", Icon: Youtube, className: "bg-[#FF0000] hover:bg-[#e60000]" },
    { href: whatsappUrl, label: "WhatsApp", Icon: MessageCircle, className: "bg-[#25D366] hover:bg-[#20bd5a]" },
  ] as const;
}

function getPhoneDisplay(phone: string) { return phone; }
function getPhoneTel(phone: string) { return `tel:${phone.replace(/\D/g, "")}`; }


function QuoteInquiryDialog({
  open,
  onOpenChange,
  initialService,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialService: string;
}) {
  const [sent, setSent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    setFormKey((k) => k + 1);
  }, [open, initialService]);

  const serviceOptions = useMemo(
    () => ["Water Treatment", "RO Plant", "STP Plant", "ETP Plant", "ZLD System", "Consultation", "Other"],
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Get a Quote</DialogTitle>
          <DialogDescription>We will respond within one business day.</DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="font-semibold text-emerald-900">Thank you!</p>
            <p className="mt-1 text-sm text-emerald-800">Your enquiry has been received.</p>
          </div>
        ) : (
          <form
            key={formKey}
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addLead({
                name: String(fd.get("name") ?? ""),
                phone: String(fd.get("phone") ?? ""),
                email: String(fd.get("email") ?? ""),
                company: String(fd.get("company") ?? ""),
                service: String(fd.get("service") ?? initialService),
                message: String(fd.get("message") ?? ""),
              });
              setSent(true);
            }}
          >
            <input name="name" required placeholder="Full name" className="rounded-md border px-3 py-2 text-sm" />
            <input name="phone" required placeholder="Phone" className="rounded-md border px-3 py-2 text-sm" />
            <input name="email" type="email" required placeholder="Email" className="rounded-md border px-3 py-2 text-sm" />
            <select name="service" defaultValue={initialService} className="rounded-md border px-3 py-2 text-sm">
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <textarea name="message" required rows={3} placeholder="Message" className="rounded-md border px-3 py-2 text-sm resize-none" />
            <button type="submit" className="rounded-md bg-[#1a5276] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#154360]">
              Send Enquiry
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


function syncSiteHeaderHeight(el: HTMLElement) {
  const h = el.offsetHeight;
  document.documentElement.style.setProperty("--site-header-height", `${h}px`);
  return h;
}

export function Navbar() {
  const { pathname } = useLocation();
  const { settings } = useWebsiteSettings();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("Consultation");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const socialLinks = getSocialLinks(settings);
  const phoneDisplay = getPhoneDisplay(settings.phone);
  const phoneTel = getPhoneTel(settings.phone);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () => syncSiteHeaderHeight(el);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => { ro.disconnect(); window.removeEventListener("resize", sync); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ service?: string }>).detail;
      setQuoteService(detail?.service ?? "Consultation");
      setQuoteOpen(true);
    };
    window.addEventListener("khm-open-quote", handler);
    return () => window.removeEventListener("khm-open-quote", handler);
  }, []);

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const isCompanyActive = pathname.startsWith("/about");

  const openQuote = useCallback((service: string) => {
    setQuoteService(service);
    setQuoteOpen(true);
  }, []);

  return (
    <>
      {/* ── Scoped styles for 3D nav effects ── */}
      <style>{`
        /* ── Nav link base ── */
        .nav-link-3d {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 8px 18px;
          margin: 24px 3px;
          font-size: 1rem;
          font-weight: 500;
          color: #4a5568;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
          text-decoration: none;
        }
        /* Hover — light preview of the active button */
        .nav-link-3d:hover {
          color: #1a4a6b;
          background: rgba(26,74,107,0.08);
          transform: translateY(-1px);
        }
        /* Active — full button-style matching Contact Us */
        .nav-link-3d.active {
          color: #fff;
          font-weight: 600;
          background: linear-gradient(135deg, #1a4a6b 0%, #2d6a8f 50%, #1a4a6b 100%);
          box-shadow:
            0 3px 10px rgba(26,74,107,0.35),
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.15);
          transform: none;
        }
        .nav-link-3d.active:hover {
          background: linear-gradient(135deg, #1f5580 0%, #2d6a8f 50%, #1f5580 100%);
          transform: translateY(-1px);
        }

        /* ── CTA Contact Us button ── */
        .cta-btn-3d {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 28px;
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
          border-radius: 8px;
          background: linear-gradient(135deg, #1a3a5c 0%, #2a5f8a 50%, #1a3a5c 100%);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow:
            0 4px 15px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
          text-decoration: none;
          cursor: pointer;
          outline: none;
          letter-spacing: 0.01em;
        }
        .cta-btn-3d:hover {
          background: linear-gradient(135deg, #1f4a72 0%, #2f6fa0 50%, #1f4a72 100%);
          transform: translateY(-1px);
          box-shadow:
            0 6px 20px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .cta-btn-3d:active {
          transform: translateY(1px);
          box-shadow:
            0 2px 6px rgba(0,0,0,0.25),
            inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .cta-btn-3d.active-page {
          background: linear-gradient(135deg, #0d2e4a 0%, #1a4a6b 100%);
        }

        /* ── Header shell ── */
        .header-3d {
          position: sticky;
          top: 0;
          z-index: 200;
          width: 100%;
          border-top: 1px solid transparent;
          background-image:
            linear-gradient(white, white),
            linear-gradient(90deg, transparent 10%, #f5c518 50%, transparent 90%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          transition: background-color 0.35s, box-shadow 0.35s, backdrop-filter 0.35s;
        }
        .header-3d.scrolled {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow:
            0 8px 32px rgba(13,61,92,0.12),
            0 2px 8px rgba(0,0,0,0.06),
            0 0 0 1px rgba(26,82,118,0.06);
        }
      `}</style>

      <header ref={headerRef} className="header-3d" data-scrolled={scrolled} style={scrolled ? { background: 'rgba(255,255,255,0.92)' } : {}}>

        {/* ── Top bar ── */}
        <div
          className="hidden md:block"
          style={{
            background: "linear-gradient(90deg, #0d3d5c 0%, #1a5276 40%, #1a5276 60%, #0d3d5c 100%)",
            borderBottom: "1px solid rgba(245,197,24,0.25)",
            boxShadow: "0 1px 0 rgba(0,200,208,0.1) inset",
          }}
        >
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 text-xs text-white/90 lg:px-6">
            <div className="flex items-center gap-5">
              <a href={phoneTel} className="inline-flex items-center gap-1.5 transition-all duration-200 hover:text-[#f5c518] hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)]">
                <Phone className="h-3.5 w-3.5 text-[#f5c518]" aria-hidden />
                {phoneDisplay}
              </a>
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-1.5 transition-all duration-200 hover:text-[#f5c518] hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)]">
                <Mail className="h-3.5 w-3.5 text-[#f5c518]" aria-hidden />
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              {socialLinks.map(({ href, label, Icon, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-white transition-all duration-200 hover:scale-110 hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]",
                    className,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main navbar ── */}
        <div
          style={{
            borderBottom: scrolled ? "1px solid rgba(26,82,118,0.08)" : "1px solid rgba(226,232,240,0.8)",
            background: scrolled ? "transparent" : "rgba(255,255,255,0.97)",
            boxShadow: scrolled ? "none" : "0 2px 12px rgba(13,61,92,0.06), inset 0 -1px 0 rgba(226,232,240,0.6)",
          }}
        >
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-8 min-h-[90px]">

            {/* Logo — floats clean, no card wrapper */}
            <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
              <BrandLogoLink
                imageClassName="h-20 w-auto max-w-[280px] object-contain sm:h-24 sm:max-w-[300px] lg:h-24 lg:max-w-[320px]"
              />

              {/* Desktop nav links */}
              <nav className="hidden flex-wrap items-center lg:flex" aria-label="Main">
                {[
                  { to: "/", label: "Home", active: pathname === "/" },
                  { to: "/about", label: "About Us", active: isCompanyActive },
                  { to: "/our-services", label: "Our Services", active: isActive("/our-services") },
                  { to: "/projects", label: "Projects", active: isActive("/projects") },
                  { to: "/gallery", label: "Gallery", active: isActive("/gallery") },
                  { to: "/blog", label: "Blog", active: isActive("/blog") },
                  { to: "/careers", label: "Careers", active: isActive("/careers") },
                ].map(({ to, label, active }) => (
                  <Link
                    key={to}
                    to={to}
                    className={cn("nav-link-3d", active && "active")}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/contact"
                className={cn("cta-btn-3d", isActive("/contact") && "active-page")}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={phoneTel}
                className="grid h-9 w-9 place-items-center rounded-lg text-[#1a5276] hover:bg-[#1a5276]/5 transition-colors"
                aria-label="Call"
              >
                <Phone className="h-5 w-5" />
              </a>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-xl text-[#1a5276] transition-all hover:bg-[#1a5276]/8"
                style={{
                  background: "rgba(26,82,118,0.06)",
                  border: "1px solid rgba(26,82,118,0.12)",
                  boxShadow: "0 1px 3px rgba(13,61,92,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] lg:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col shadow-2xl"
                style={{
                  background: "linear-gradient(160deg, #f8fafc 0%, #ffffff 100%)",
                  borderLeft: "1px solid rgba(26,82,118,0.1)",
                }}
              >
                {/* Drawer header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid rgba(26,82,118,0.08)", background: "rgba(255,255,255,0.9)" }}
                >
                  <BrandLogoLink
                    imageClassName="h-10 w-auto max-w-[180px] object-contain"
                    onClick={() => setMobileOpen(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer links */}
                <div className="flex-1 overflow-y-auto py-2">
                  <MobileNavLink to="/" label="Home" onNavigate={() => setMobileOpen(false)} active={isActive("/")} />
                  <MobileNavLink to="/about" label="About Us" onNavigate={() => setMobileOpen(false)} active={isCompanyActive} />
                  <MobileNavLink to="/our-services" label="Our Services" onNavigate={() => setMobileOpen(false)} active={isActive("/our-services")} />
                  <MobileNavLink to="/projects" label="Projects" onNavigate={() => setMobileOpen(false)} active={isActive("/projects")} />
                  <MobileNavLink to="/gallery" label="Gallery" onNavigate={() => setMobileOpen(false)} active={isActive("/gallery")} />
                  <MobileNavLink to="/blog" label="Blog" onNavigate={() => setMobileOpen(false)} active={isActive("/blog")} />
                  <MobileNavLink to="/careers" label="Careers" onNavigate={() => setMobileOpen(false)} active={isActive("/careers")} />
                  <MobileNavLink to="/contact" label="Contact Us" onNavigate={() => setMobileOpen(false)} active={isActive("/contact")} cta />
                </div>

                {/* Drawer footer */}
                <div
                  className="space-y-3 p-5"
                  style={{ borderTop: "1px solid rgba(26,82,118,0.08)", background: "rgba(248,250,252,0.8)" }}
                >
                  <a href={phoneTel} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1a5276] transition-colors">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ background: "linear-gradient(135deg, #1a5276 0%, #0d3d5c 100%)", boxShadow: "0 2px 6px rgba(13,61,92,0.3)" }}
                    >
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    {phoneDisplay}
                  </a>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1a5276] transition-colors">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ background: "linear-gradient(135deg, #25a244 0%, #1a7032 100%)", boxShadow: "0 2px 6px rgba(37,162,68,0.3)" }}
                    >
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    {settings.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); openQuote("Consultation"); }}
                    className="cta-btn-3d mt-3 w-full justify-center py-3"
                  >
                    Get Free Consultation
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <QuoteInquiryDialog open={quoteOpen} onOpenChange={setQuoteOpen} initialService={quoteService} />
      </header>
    </>
  );
}

function MobileNavLink({
  to,
  label,
  onNavigate,
  active,
  cta = false,
}: {
  to: string;
  label: string;
  onNavigate: () => void;
  active: boolean;
  cta?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "block px-5 py-4 text-sm font-medium transition-all duration-200",
        cta
          ? "mx-3 mt-2 mb-1 rounded-xl text-white text-center"
          : "text-gray-700 hover:text-[#1a5276]",
        active && !cta && "text-[#1a5276] font-semibold",
      )}
      style={
        cta
          ? {
              background: "linear-gradient(135deg, #1a5276 0%, #0d3d5c 100%)",
              boxShadow: "0 4px 14px rgba(13,61,92,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
            }
          : active
          ? { background: "linear-gradient(90deg, rgba(26,82,118,0.06) 0%, transparent 100%)", borderLeft: "3px solid #1a5276", paddingLeft: "17px" }
          : { borderLeft: "3px solid transparent" }
      }
    >
      {label}
    </Link>
  );
}
