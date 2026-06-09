import { MessageCircle, Phone } from "lucide-react";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

export function FloatingActions() {
  const { settings } = useWebsiteSettings();
  const phoneClean = settings.phone.replace(/\D/g, "").slice(0, 10);
  const whatsappUrl = `https://wa.me/${phoneClean}`;
  const phoneTel = `tel:${phoneClean}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
      <a
        href={phoneTel}
        aria-label="Call"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#1a5276] text-white shadow-lg transition-transform hover:scale-105"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
