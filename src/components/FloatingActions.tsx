import { MessageCircle, Phone } from "lucide-react";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
  const { settings } = useWebsiteSettings();
  const { isMobileMenuOpen } = useMobileMenu();
  const phoneClean = "9511785597";
  const whatsappUrl = `https://wa.me/${phoneClean}`;
  const phoneTel = `tel:${phoneClean}`;

  return (
    <AnimatePresence>
      {!isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
          </a>
          <a
            href={phoneTel}
            aria-label="Call"
            className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#1a5276] text-white shadow-lg transition-transform hover:scale-105"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
