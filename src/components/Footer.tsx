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
} from "lucide-react";
import { BrandLogoLink } from "@/components/BrandLogo";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

const QUICK_LINKS = [
  ["/", "Home"],
  ["/about", "Company"],
  ["/services", "Services"],
  ["/projects", "Projects"],
  ["/gallery", "Gallery"],
  ["/clients", "Client"],
  ["/sectors-we-serve", "Industries We Serve"],
  ["/blog", "Blog"],
  ["/careers", "Careers"],
  ["/contact", "Contact Us"],
] as const;

function getSocialLinks(settings: ReturnType<typeof useWebsiteSettings>["settings"]) {
  const phoneClean = settings.phone.replace(/\D/g, "").slice(0, 10);
  const whatsappUrl = `https://wa.me/${phoneClean}`;
  
  return [
    { Icon: Facebook, href: settings.facebook || "https://facebook.com", label: "Facebook" },
    { Icon: Twitter, href: settings.twitter || "https://twitter.com", label: "Twitter" },
    { Icon: Linkedin, href: settings.linkedin || "https://linkedin.com", label: "LinkedIn" },
    { Icon: Instagram, href: settings.instagram || "https://instagram.com", label: "Instagram" },
    { Icon: Youtube, href: settings.youtube || "https://youtube.com", label: "YouTube" },
    { Icon: MessageCircle, href: whatsappUrl, label: "WhatsApp" },
  ] as const;
}

function getPhoneNumbers(phone: string) {
  const numbers = phone.split(",").map(p => p.trim());
  return numbers.map(n => ({
    display: n,
    tel: n.replace(/\D/g, ""),
  }));
}

export function Footer() {
  const { settings } = useWebsiteSettings();
  const socialLinks = getSocialLinks(settings);
  const phones = getPhoneNumbers(settings.phone);
  return (
    <footer className="relative mt-0 bg-[#0d3d5c] text-white">
      <div className="mx-auto max-w-[1400px] gap-10 px-4 py-14 lg:px-6 grid sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogoLink imageClassName="h-16 w-auto max-w-[300px] sm:h-20" withBackground />
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            KHM Infra Innovations delivers advanced water and wastewater treatment systems for residential,
            industrial and government infrastructure.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
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
          <ul className="mt-4 space-y-2 text-sm text-white/80">
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
            {phones.map((phone) => (
              <li key={phone.tel} className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#f5c518]" />
                <a href={`tel:${phone.tel}`} className="hover:text-[#f5c518]">
                  {phone.display}
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
          <p className="mt-4 text-xs text-white/50">CIN: U71100PN2026PTC255526</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/55 sm:flex-row lg:px-6">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <p>{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
