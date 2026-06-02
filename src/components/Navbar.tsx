import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
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
import { GALLERY_SECTIONS, galleryHash } from "@/lib/gallery-sections";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";
import { cn } from "@/lib/utils";

type MenuKey = "company" | "product" | "gallery";

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

/** Product mega-menu — matches site IA (water treatment, wastewater, manufacturing, O&M). */
const PRODUCT_MENU_COLUMNS: {
  sections: { title: string; items: { label: string; to: string }[] }[];
}[] = [
  {
    sections: [
      {
        title: "Water Treatment Plant",
        items: [
          { label: "Clarifier System", to: "/products/clarifier-system" },
          { label: "Water Filtration Plant", to: "/products/water-filtration-plant" },
          { label: "Water Softener Plant", to: "/products/water-softening-plant" },
          { label: "Ultra Filtration Plant", to: "/products/ultra-filtration-plant" },
          { label: "Reverse Osmosis Plant", to: "/products/reverse-osmosis-plant" },
          { label: "Seawater Desalination Plant", to: "/products/seawater-desalination-plant" },
          { label: "Demineralization Plant", to: "/products/demineralization-plant" },
        ],
      },
      {
        title: "Services",
        items: [
          { label: "Our Services", to: "/services" },
          { label: "Operation & Maintenance", to: "/services#om-amc" },
        ],
      },
      {
        title: "Technology & Tools",
        items: [{ label: "Technology & Tools", to: "/products/technology-tools" }],
      },
    ],
  },
  {
    sections: [
      {
        title: "Waste Water Treatment",
        items: [
          { label: "Sewage Treatment Plant", to: "/products/sewage-treatment-plant" },
          { label: "Effluent Treatment Plant", to: "/products/effluent-treatment-plant" },
          { label: "Condensate Polishing Unit", to: "/products/condensate-polishing-unit" },
          { label: "Zero Liquid Discharge System", to: "/products/zero-liquid-discharge-system" },
          { label: "Oil Water Separator (OWS)", to: "/products/oil-water-separator" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Manufacturing",
        items: [
          { label: "Surge Vessel", to: "/products/surge-vessel" },
          { label: "ASME Vessels U & R Stamp", to: "/products/asme-vessels" },
          { label: "Pressure Vessel", to: "/products/pressure-vessels" },
          { label: "Electrical Control Panels", to: "/products/electrical-control-panels" },
        ],
      },
    ],
  },
];

/** Company mega-menu — same layout as product; labels and routes unchanged. */
const COMPANY_MENU_COLUMNS: {
  sections: { title: string; items: { label: string; to: string }[] }[];
}[] = [
  {
    sections: [
      {
        title: "About Us",
        items: [
          { label: "About Us", to: "/about#about-us" },
          { label: "Our Vision", to: "/about#vision" },
          { label: "Our Mission", to: "/about" },
          { label: "Leadership Team", to: "/about" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Infrastructure",
        items: [
          { label: "Infrastructure", to: "/infrastructure" },
          { label: "Industries We Serve", to: "/sectors-we-serve" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Certifications",
        items: [{ label: "Certifications", to: "/about" }],
      },
      {
        title: "CSR Activities",
        items: [{ label: "CSR Activities", to: "/about" }],
      },
    ],
  },
];

/** Gallery mega-menu — same layout as product; labels and routes from GALLERY_SECTIONS. */
const GALLERY_MENU_COLUMNS: {
  sections: { title: string; items: { label: string; to: string }[] }[];
}[] = GALLERY_SECTIONS.map((s) => ({
  sections: [
    {
      title: s.label,
      items: [{ label: s.label, to: galleryHash(s.id) }],
    },
  ],
}));

function MegaMenuSection({
  title,
  items,
  onNavigate,
  variant = "desktop",
}: {
  title: string;
  items: { label: string; to: string }[];
  onNavigate: () => void;
  variant?: "desktop" | "mobile";
}) {
  if (variant === "mobile") {
    return (
      <div className="rounded-lg bg-gradient-to-br from-[#f8fbfd] to-white px-3 py-3 ring-1 ring-[#1a5276]/8">
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#f5c518] to-[#e6b800]" aria-hidden />
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a5276]">{title}</p>
        </div>
        <ul className="mt-2.5 space-y-0.5">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                onClick={onNavigate}
                className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium leading-snug text-gray-600 transition-all hover:bg-white hover:pl-3 hover:text-[#1a5276] hover:shadow-sm"
              >
                <span className="min-w-0 flex-1">{item.label}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#1a5276]/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1a5276]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="h-4 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#f5c518] to-[#e6b800]" aria-hidden />
        <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#1a5276]">{title}</p>
      </div>
      <ul className="mt-3 space-y-0.5 border-l border-[#1a5276]/10 pl-3">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className="group flex items-center gap-2 rounded-md border-l-2 border-transparent px-2.5 py-2 text-[13px] font-medium leading-snug text-gray-600 transition-all duration-200 hover:border-[#1a5276] hover:bg-[#1a5276]/[0.04] hover:text-[#1a5276]"
            >
              <span className="min-w-0 flex-1">{item.label}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#1a5276]/0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#1a5276]/70" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function SimpleDropdown({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute left-0 top-full z-50 min-w-[220px] border border-gray-100 bg-white py-2 shadow-lg",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
  const [desktopOpen, setDesktopOpen] = useState<MenuKey | null>(null);
  const closeTimer = useRef<number | null>(null);
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

  const openDesktop = (key: MenuKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setDesktopOpen(key);
  };
  const scheduleCloseDesktop = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setDesktopOpen(null), 140);
  };

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const navLink = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1 px-3 lg:px-4 py-6 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#1a5276]",
      active && "text-[#1a5276] font-semibold bg-gray-50/80",
    );

  const isProductActive =
    pathname.startsWith("/services") ||
    pathname.startsWith("/products/") ||
    pathname === "/technology";

  const isCompanyActive =
    pathname.startsWith("/about") || pathname.startsWith("/infrastructure") || pathname.startsWith("/sectors-we-serve");

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
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-8">
            <BrandLogoLink
              withBackground
              imageClassName="h-16 w-auto max-w-[260px] py-1 sm:h-[4.5rem] sm:max-w-[300px] lg:h-20 lg:max-w-[360px]"
            />

            <nav className="hidden flex-wrap items-center lg:flex" aria-label="Main">
              <Link to="/" className={navLink(pathname === "/")}>
                Home
              </Link>

              <div className="relative" onMouseEnter={() => openDesktop("company")} onMouseLeave={scheduleCloseDesktop}>
                <button
                  type="button"
                  className={navLink(isCompanyActive)}
                  aria-expanded={desktopOpen === "company"}
                  onClick={() => setDesktopOpen((v) => (v === "company" ? null : "company"))}
                >
                  Company <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <SimpleDropdown
                  open={desktopOpen === "company"}
                  className="min-w-[min(100vw-2rem,900px)] max-w-[940px] overflow-hidden rounded-xl border border-gray-100 p-0 py-0 shadow-2xl shadow-[#1a5276]/10"
                >
                  <div className="bg-gradient-to-r from-[#1a5276] via-[#1e6091] to-[#154360] px-8 py-4">
                    <p className="text-sm font-semibold text-white">Our Company</p>
                    <p className="mt-0.5 text-xs text-white/75">Profile, infrastructure &amp; corporate responsibility</p>
                  </div>
                  <div className="bg-gradient-to-b from-[#f8fbfd] to-white">
                    <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-gray-100">
                      {COMPANY_MENU_COLUMNS.map((col, colIdx) => (
                        <div key={colIdx} className="min-w-0 space-y-7 px-7 py-7">
                          {col.sections.map((section) => (
                            <MegaMenuSection
                              key={section.title}
                              title={section.title}
                              items={section.items}
                              onNavigate={() => setDesktopOpen(null)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/about"
                      onClick={() => setDesktopOpen(null)}
                      className="group flex items-center justify-between border-t border-gray-100 bg-white px-8 py-3.5 text-sm font-semibold text-[#1a5276] transition-colors hover:bg-[#1a5276]/[0.04]"
                    >
                      <span>About Us</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </SimpleDropdown>
              </div>

              <div className="relative" onMouseEnter={() => openDesktop("product")} onMouseLeave={scheduleCloseDesktop}>
                <button
                  type="button"
                  className={navLink(isProductActive)}
                  aria-expanded={desktopOpen === "product"}
                  onClick={() => setDesktopOpen((v) => (v === "product" ? null : "product"))}
                >
                  Product <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <SimpleDropdown
                  open={desktopOpen === "product"}
                  className="min-w-[min(100vw-2rem,900px)] max-w-[940px] overflow-hidden rounded-xl border border-gray-100 p-0 py-0 shadow-2xl shadow-[#1a5276]/10"
                >
                  <div className="bg-gradient-to-r from-[#1a5276] via-[#1e6091] to-[#154360] px-8 py-4">
                    <p className="text-sm font-semibold text-white">Our Product Range</p>
                    <p className="mt-0.5 text-xs text-white/75">Water treatment, wastewater solutions &amp; manufacturing</p>
                  </div>
                  <div className="bg-gradient-to-b from-[#f8fbfd] to-white">
                    <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-gray-100">
                      {PRODUCT_MENU_COLUMNS.map((col, colIdx) => (
                        <div key={colIdx} className="min-w-0 space-y-7 px-7 py-7">
                          {col.sections.map((section) => (
                            <MegaMenuSection
                              key={section.title}
                              title={section.title}
                              items={section.items}
                              onNavigate={() => setDesktopOpen(null)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/services"
                      onClick={() => setDesktopOpen(null)}
                      className="group flex items-center justify-between border-t border-gray-100 bg-white px-8 py-3.5 text-sm font-semibold text-[#1a5276] transition-colors hover:bg-[#1a5276]/[0.04]"
                    >
                      <span>View all products &amp; services</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </SimpleDropdown>
              </div>

              <Link to="/clients" className={navLink(isActive("/clients"))}>
                Client
              </Link>

              <div className="relative" onMouseEnter={() => openDesktop("gallery")} onMouseLeave={scheduleCloseDesktop}>
                <button
                  type="button"
                  className={navLink(pathname.startsWith("/gallery"))}
                  aria-expanded={desktopOpen === "gallery"}
                  onClick={() => setDesktopOpen((v) => (v === "gallery" ? null : "gallery"))}
                >
                  Gallery <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <SimpleDropdown
                  open={desktopOpen === "gallery"}
                  className="min-w-[min(100vw-2rem,900px)] max-w-[940px] overflow-hidden rounded-xl border border-gray-100 p-0 py-0 shadow-2xl shadow-[#1a5276]/10"
                >
                  <div className="bg-gradient-to-r from-[#1a5276] via-[#1e6091] to-[#154360] px-8 py-4">
                    <p className="text-sm font-semibold text-white">Our Gallery</p>
                    <p className="mt-0.5 text-xs text-white/75">Infrastructure, products &amp; festivals</p>
                  </div>
                  <div className="bg-gradient-to-b from-[#f8fbfd] to-white">
                    <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-gray-100">
                      {GALLERY_MENU_COLUMNS.map((col, colIdx) => (
                        <div key={colIdx} className="min-w-0 space-y-7 px-7 py-7">
                          {col.sections.map((section) => (
                            <MegaMenuSection
                              key={section.title}
                              title={section.title}
                              items={section.items}
                              onNavigate={() => setDesktopOpen(null)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/gallery"
                      onClick={() => setDesktopOpen(null)}
                      className="group flex items-center justify-between border-t border-gray-100 bg-white px-8 py-3.5 text-sm font-semibold text-[#1a5276] transition-colors hover:bg-[#1a5276]/[0.04]"
                    >
                      <span>View All Gallery</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </SimpleDropdown>
              </div>

              <Link to="/blog" className={navLink(isActive("/blog"))}>
                Blog
              </Link>

              <Link to="/contact" className={navLink(isActive("/contact"))}>
                Contact Us
              </Link>
            </nav>
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
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <BrandLogoLink
                  withBackground
                  imageClassName="h-14 w-auto max-w-[240px] sm:h-16"
                  onClick={() => setMobileOpen(false)}
                />
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                <MobileNavLink to="/" label="Home" onNavigate={() => setMobileOpen(false)} active={isActive("/")} />
                <MobileAccordion title="Company" defaultOpen={isCompanyActive}>
                  <div className="space-y-3 px-4 pb-2">
                    {COMPANY_MENU_COLUMNS.flatMap((col) =>
                      col.sections.map((section) => (
                        <MegaMenuSection
                          key={section.title}
                          title={section.title}
                          items={section.items}
                          onNavigate={() => setMobileOpen(false)}
                          variant="mobile"
                        />
                      )),
                    )}
                    <Link
                      to="/about"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1a5276] to-[#154360] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      About Us
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </MobileAccordion>
                <MobileAccordion title="Product" defaultOpen={isProductActive}>
                  <div className="space-y-3 px-4 pb-2">
                    {PRODUCT_MENU_COLUMNS.flatMap((col) =>
                      col.sections.map((section) => (
                        <MegaMenuSection
                          key={section.title}
                          title={section.title}
                          items={section.items}
                          onNavigate={() => setMobileOpen(false)}
                          variant="mobile"
                        />
                      )),
                    )}
                    <Link
                      to="/services"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1a5276] to-[#154360] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      View all products &amp; services
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </MobileAccordion>
                <MobileNavLink to="/clients" label="Client" onNavigate={() => setMobileOpen(false)} active={isActive("/clients")} />
                <MobileAccordion title="Gallery" defaultOpen={pathname.startsWith("/gallery")}>
                  <div className="space-y-3 px-4 pb-2">
                    {GALLERY_MENU_COLUMNS.flatMap((col) =>
                      col.sections.map((section) => (
                        <MegaMenuSection
                          key={section.title}
                          title={section.title}
                          items={section.items}
                          onNavigate={() => setMobileOpen(false)}
                          variant="mobile"
                        />
                      )),
                    )}
                    <Link
                      to="/gallery"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1a5276] to-[#154360] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      View All Gallery
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </MobileAccordion>
                <MobileNavLink to="/blog" label="Blog" onNavigate={() => setMobileOpen(false)} active={isActive("/blog")} />
                <MobileNavLink to="/contact" label="Contact Us" onNavigate={() => setMobileOpen(false)} active={isActive("/contact")} />
              </div>

              <div className="space-y-2 border-t border-gray-200 p-4">
                <a href={SITE_PHONE_TEL} className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-[#1a5276]" /> {SITE_PHONE_DISPLAY}
                </a>
                <a href={`mailto:${SITE_EMAIL}`} className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-[#1a5276]" /> {SITE_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openQuote("Consultation");
                  }}
                  className="mt-2 w-full rounded bg-[#1a5276] py-2.5 text-sm font-semibold text-white"
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
}: {
  to: string;
  label: string;
  onNavigate: () => void;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "block border-b border-gray-100 px-4 py-3.5 text-sm font-medium text-gray-800",
        active && "bg-gray-50 text-[#1a5276]",
      )}
    >
      {label}
    </Link>
  );
}

function MobileAccordion({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-800"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}
