import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Hash,
} from "lucide-react";
import { BrandLogoLink } from "@/components/BrandLogo";
import { SITE_ADDRESS, SITE_EMAIL, SITE_PHONES, SITE_WHATSAPP_URL } from "@/lib/site-contact";

const QUICK_LINKS = [
  ["/", "Home"],
  ["/about", "Company"],
  ["/services", "Services"],
  ["/projects", "Projects"],
  ["/gallery", "Gallery"],
  ["/clients", "Clients"],
  ["/sectors-we-serve", "Industries We Serve"],
  ["/blog", "Blog"],
  ["/contact", "Contact Us"],
] as const;


const SOCIAL = [
  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { Icon: MessageCircle, href: SITE_WHATSAPP_URL, label: "WhatsApp" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-0 bg-[#0d3d5c] text-white">
      <div className="mx-auto max-w-[1400px] gap-10 px-4 py-16 lg:px-6 grid sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogoLink imageClassName="h-16 w-auto max-w-[300px] sm:h-20" withBackground />
          <p className="mt-4 max-w-[460px] text-sm leading-relaxed text-white/75">
            KHM Infra Innovations delivers advanced water and wastewater treatment systems for residential,
            industrial and government infrastructure.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#f5c518] hover:text-[#0d3d5c]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#f5c518]">Quick Links</h4>
          <ul className="mt-4 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            {QUICK_LINKS.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-[#f5c518] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#f5c518]">Contact Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f5c518]" />
              <span>{SITE_ADDRESS}</span>
            </li>
            {SITE_PHONES.map((phone) => (
              <li key={phone.tel} className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#f5c518]" />
                <a href={`tel:${phone.tel}`} className="hover:text-[#f5c518]">
                  {phone.display}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#f5c518]" />
              <a href={`mailto:${SITE_EMAIL}`} className="hover:text-[#f5c518]">
                {SITE_EMAIL}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-white/50 flex items-center gap-2">
            <Hash className="h-3 w-3 text-[#f5c518]" aria-hidden />
            <span>CIN: U71100PN2026PTC255526</span>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/55 sm:flex-row sm:text-left lg:px-6">
          <p>© {new Date().getFullYear()} KHM Infra Innovations Private Limited. All rights reserved.</p>
          <p>Engineered for sustainable water infrastructure.</p>
        </div>
      </div>
    </footer>
  );
}