// Lightweight localStorage-backed admin store + auth (frontend-only).
// NOTE: Hardcoded credentials are insecure by design — front-end demo only.
import { useEffect, useState, useCallback } from "react";

export const ADMIN_EMAIL = "admin@khminfra.com";
export const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "khm_admin_auth_v1";

export type Service = { id: string; title: string; icon: string; description: string; image?: string };
export type Project = { id: string; title: string; category: "Government" | "Residential" | "Industrial" | "Commercial"; location: string; description: string; image?: string };
export type BlogPost = { id: string; title: string; slug: string; excerpt: string; content: string; image?: string; tags: string; seoTitle?: string; seoDescription?: string; createdAt: number };
export type Testimonial = { id: string; name: string; role: string; quote: string; rating: number };
export type TeamMember = { id: string; name: string; role: string; bio: string; image?: string; imagePublicId?: string };
export type Lead = { id: string; name: string; email: string; phone: string; company?: string; service: string; message: string; status: "new" | "contacted" | "closed"; createdAt: number };
export type Settings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  heroTitle: string;
  heroSubtitle: string;
  footerNote: string;
  seoTitle: string;
  seoDescription: string;
};

type Schema = {
  services: Service[];
  projects: Project[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  team: TeamMember[];
  leads: Lead[];
  settings: Settings;
};

const STORE_KEY = "khm_admin_store_v1";

const defaults: Schema = {
  services: [
    { id: uid(), title: "Sewage Treatment Plant (STP)", icon: "Droplets", description: "Compact, modular STPs for residential and commercial complexes." },
    { id: uid(), title: "Effluent Treatment Plant (ETP)", icon: "FlaskConical", description: "Industrial ETPs designed for compliance and zero liquid discharge." },
    { id: uid(), title: "Water Recycling", icon: "Recycle", description: "Closed-loop recycling turning waste streams into reusable resources." },
    { id: uid(), title: "Rain Water Harvesting", icon: "CloudRain", description: "Site-specific harvesting and recharge systems." },
    { id: uid(), title: "Industrial Water Treatment", icon: "Factory", description: "Process-specific treatment for factories and chemical industries." },
  ],
  projects: [
    { id: uid(), title: "Smart City STP — Pune Phase II", category: "Government", location: "Pune, MH", description: "1.2 MLD modular STP serving 18,000 residents." },
    { id: uid(), title: "Tech Park ETP — Hinjewadi", category: "Commercial", location: "Pune, MH", description: "Effluent recycling with 92% reuse rate." },
    { id: uid(), title: "Township Recycling — Wakad", category: "Residential", location: "Pune, MH", description: "Greywater recycling for landscaping & flushing." },
    { id: uid(), title: "Industrial ZLD — Chakan", category: "Industrial", location: "Pune, MH", description: "Zero liquid discharge for automotive cluster." },
  ],
  blog: [
    { id: uid(), title: "Why STPs Matter for Smart Cities", slug: "stp-smart-cities", excerpt: "How decentralized sewage treatment is reshaping urban India.", content: "Detailed article content goes here.", tags: "STP, Smart City", createdAt: Date.now() - 86400000 * 4 },
  ],
  testimonials: [
    { id: uid(), name: "R. Sharma", role: "Facility Head, Tech Park", quote: "KHM delivered our ETP three weeks ahead of schedule.", rating: 5 },
  ],
  team: [
    { id: uid(), name: "Kunal H. Mehta", role: "Founder & CEO", bio: "20+ years in waste water engineering." },
  ],
  leads: [],
  settings: {
    companyName: "KHM Infra Innovations Private Limited",
    tagline: "Sustainable waste water engineering",
    email: "khminfrainnovations@gmail.com",
    phone: "+91 9028716090, 9511785597",
    address:
      "Office No. St-1B, Stilt Floor, Axis Business Centre, Near Marigold Banquets, Bhugaon – 412115, Maharashtra, India",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    heroTitle: "Engineering Water for a Sustainable Tomorrow",
    heroSubtitle: "Turnkey waste water management for buildings, industry & smart cities.",
    footerNote: "Engineered with care for a sustainable tomorrow.",
    seoTitle: "KHM Infra Innovations | Waste Water Management",
    seoDescription: "Advanced sewage and effluent treatment, water recycling, and smart water infrastructure.",
  },
};

export function uid() { return Math.random().toString(36).slice(2, 10); }

function read(): Schema {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch { return defaults; }
}
function write(s: Schema) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("khm-admin-store"));
}

export function getStore(): Schema { return read(); }

export function useAdminCollection<K extends keyof Schema>(key: K) {
  const [data, setData] = useState<Schema[K]>(() => read()[key]);

  useEffect(() => {
    const sync = () => setData(read()[key]);
    sync();
    window.addEventListener("khm-admin-store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("khm-admin-store", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const set = useCallback((next: Schema[K]) => {
    const s = read();
    (s as any)[key] = next;
    write(s);
    setData(next);
  }, [key]);

  return [data, set] as const;
}

export function addLead(lead: Omit<Lead, "id" | "status" | "createdAt">) {
  const s = read();
  s.leads = [{ ...lead, id: uid(), status: "new", createdAt: Date.now() }, ...s.leads];
  write(s);
}

// ---------- Auth ----------
export function login(email: string, password: string, remember: boolean): boolean {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return false;
  const payload = JSON.stringify({ email, at: Date.now() });
  (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, payload);
  return true;
}
export function logout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}
export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY));
}
export function useAuthed() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setAuthed(isAuthed()); }, []);
  return [authed, setAuthed] as const;
}
