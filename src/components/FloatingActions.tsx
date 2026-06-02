import { MessageCircle, Phone } from "lucide-react";
import { SITE_PHONE_TEL, SITE_WHATSAPP_URL } from "@/lib/site-contact";

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={SITE_WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
      <a
        href={SITE_PHONE_TEL}
        aria-label="Call"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#1a5276] text-white shadow-lg transition-transform hover:scale-105"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
