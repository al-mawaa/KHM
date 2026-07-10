import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Instagram,
  MessageCircle,
  Youtube,
  Hash,
} from "lucide-react";
import { BrandLogoLink } from "@/components/BrandLogo";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

const QUICK_LINKS = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/projects", "Projects"],
  ["/gallery", "Gallery"],
  ["/blog", "Blog"],
  ["/contact", "Contact Us"],
] as const;

export function Footer() {
  const { settings } = useWebsiteSettings();

  // Parse phone numbers from settings.phone string
  const phoneNumbers = settings.phone.split(',').map(p => p.trim()).filter(p => p);
  const phoneClean = "9511785597";
  const whatsappUrl = `https://wa.me/${phoneClean}`;

  const SOCIAL = [
    { Icon: Linkedin, href: settings.linkedin || "https://linkedin.com", label: "LinkedIn" },
    { Icon: Instagram, href: settings.instagram || "https://instagram.com", label: "Instagram" },
    { Icon: Youtube, href: settings.youtube || "https://youtube.com", label: "YouTube" },
    { Icon: MessageCircle, href: whatsappUrl, label: "WhatsApp" },
  ] as const;

  console.log('[Footer] Settings received:', settings);

  return (
    <footer className="relative mt-0 bg-[#0d3d5c] text-white">
      <div className="mx-auto max-w-[1400px] gap-10 px-4 py-16 lg:px-6 grid sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogoLink imageClassName="h-16 w-auto max-w-[300px] sm:h-20" withBackground />
          <p className="mt-4 max-w-[460px] text-sm leading-relaxed text-white/75">
            {settings.tagline}
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
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
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
              <span>{settings.address}</span>
            </li>
            {phoneNumbers.map((phone, index) => (
              <li key={index} className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#f5c518]" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-[#f5c518]">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#f5c518]" />
              <a href={`mailto:${settings.email}`} className="hover:text-[#f5c518]">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-2 px-4 py-5 text-center text-xs text-white/55 sm:flex-row lg:px-6">
          <p className="sm:flex-1 sm:text-left">© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>

          <p className="sm:flex-1 text-center">
            Designed &amp; Developed by&nbsp;
            <a
              href="https://www.al-mawa.international/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 hover:text-white hover:font-bold transition-colors"
            >
              Al-Mawa International
            </a>
          </p>

          <p className="sm:flex-1 sm:text-right">{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}