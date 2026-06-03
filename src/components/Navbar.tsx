import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";
import { cn } from "@/lib/utils";


const SOCIAL = [
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook, className: "bg-[#1877F2] hover:bg-[#166fe0]" },
  { href: "https://twitter.com", label: "Twitter", Icon: Twitter, className: "bg-[#1DA1F2] hover:bg-[#1a94df]" },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin, className: "bg-[#0A66C2] hover:bg-[#0958a8]" },
  {
    href: "https://instagram.com",
    label: "Instagram",
    Icon: Instagram,
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
  },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube, className: "bg-[#FF0000] hover:bg-[#e60000]" },
  { href: SITE_WHATSAPP_URL, label: "WhatsApp", Icon: MessageCircle, className: "bg-[#25D366] hover:bg-[#20bd5a]" },
] as const;




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
                <option key={s} value={s}>
                  {s}
                </option>
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("Consultation");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () => syncSiteHeaderHeight(el);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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

  const navLink = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1 px-4 lg:px-5 py-6 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-[#1a5276] relative group",
      active && "text-[#1a5276] font-semibold",
      "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-[#1a5276] after:transition-all after:duration-300 group-hover:after:w-full",
      active && "after:w-full",
    );


  const isCompanyActive = pathname.startsWith("/about");

  const openQuote = useCallback((service: string) => {
    setQuoteService(service);
    setQuoteOpen(true);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-[200] w-full bg-white",
        scrolled && "shadow-md",
      )}
    >
      {/* Top bar */}
      <div className="hidden border-b border-[#154360] bg-[#1a5276] md:block">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 text-xs text-white/90 lg:px-6">
          <div className="flex items-center gap-5">
            <a href={SITE_PHONE_TEL} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#f5c518]">
              <Phone className="h-3.5 w-3.5 text-[#f5c518]" aria-hidden />
              {SITE_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${SITE_EMAIL}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#f5c518]">
              <Mail className="h-3.5 w-3.5 text-[#f5c518]" aria-hidden />
              {SITE_EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            {SOCIAL.map(({ href, label, Icon, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-white transition-transform hover:scale-105",
                  className,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-8 lg:gap-12">
            <BrandLogoLink
              imageClassName="h-14 w-auto max-w-[220px] py-1 sm:h-[4rem] sm:max-w-[280px] lg:h-16 lg:max-w-[320px]"
            />

            <nav className="hidden flex-wrap items-center lg:flex" aria-label="Main">
              <Link to="/" className={navLink(pathname === "/")}>
                Home
              </Link>

              <Link to="/about" className={navLink(isCompanyActive)}>
                About Us
              </Link>

              <Link to="/our-services" className={navLink(isActive("/our-services"))}>
                Our Services
              </Link>

              <Link to="/clients" className={navLink(isActive("/clients"))}>
                Client
              </Link>

              <Link to="/gallery" className={navLink(isActive("/gallery"))}>
                Gallery
              </Link>

              <Link to="/blog" className={navLink(isActive("/blog"))}>
                Blog
              </Link>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1a5276] rounded-lg transition-all duration-300 hover:bg-[#154360] hover:shadow-lg hover:shadow-[#1a5276]/20 hover:-translate-y-0.5",
                isActive("/contact") && "bg-[#154360]",
              )}
            >
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a href={SITE_PHONE_TEL} className="grid h-9 w-9 place-items-center text-[#1a5276]" aria-label="Call">
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded border border-gray-200 text-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <BrandLogoLink
                  imageClassName="h-12 w-auto max-w-[200px] sm:h-14"
                  onClick={() => setMobileOpen(false)}
                />
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                <MobileNavLink to="/" label="Home" onNavigate={() => setMobileOpen(false)} active={isActive("/")} />
                <MobileNavLink to="/about" label="About Us" onNavigate={() => setMobileOpen(false)} active={isCompanyActive} />
                <MobileNavLink to="/our-services" label="Our Services" onNavigate={() => setMobileOpen(false)} active={isActive("/our-services")} />
                <MobileNavLink to="/clients" label="Client" onNavigate={() => setMobileOpen(false)} active={isActive("/clients")} />
                <MobileNavLink to="/gallery" label="Gallery" onNavigate={() => setMobileOpen(false)} active={isActive("/gallery")} />
                <MobileNavLink to="/blog" label="Blog" onNavigate={() => setMobileOpen(false)} active={isActive("/blog")} />
                <MobileNavLink to="/contact" label="Contact Us" onNavigate={() => setMobileOpen(false)} active={isActive("/contact")} cta />
              </div>

              <div className="space-y-3 border-t border-gray-100 p-5">
                <a href={SITE_PHONE_TEL} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1a5276] transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a5276]/10">
                    <Phone className="h-4 w-4 text-[#1a5276]" />
                  </div>
                  {SITE_PHONE_DISPLAY}
                </a>
                <a href={`mailto:${SITE_EMAIL}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1a5276] transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a5276]/10">
                    <Mail className="h-4 w-4 text-[#1a5276]" />
                  </div>
                  {SITE_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openQuote("Consultation");
                  }}
                  className="mt-3 w-full rounded-lg bg-[#1a5276] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#154360] hover:shadow-lg hover:shadow-[#1a5276]/20"
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
        "block border-b border-gray-50 px-5 py-4 text-sm font-medium transition-all duration-200",
        cta
          ? "bg-[#1a5276] text-white border-transparent hover:bg-[#154360]"
          : "text-gray-700 hover:bg-gray-50 hover:text-[#1a5276]",
        active && !cta && "bg-gray-50 text-[#1a5276] font-semibold",
      )}
    >
      {label}
    </Link>
  );
}

