/** Public site contact details — single source of truth. */
export const SITE_ADDRESS =
  "Office No. St-1B, Stilt Floor, Axis Business Centre, Near Marigold Banquets, Bhugaon – 412115, Maharashtra, India";

export const SITE_EMAIL = "khminfrainnovations@gmail.com";

export const SITE_PHONES = [
  { display: "+91 9028716090", tel: "+919028716090" },
  { display: "+91 9511785597", tel: "+919511785597" },
] as const;

export const SITE_PHONE_DISPLAY = SITE_PHONES.map((p) => p.display).join(", ");

export const SITE_PHONE_TEL = `tel:${SITE_PHONES[0].tel}`;

export const SITE_WHATSAPP_URL = `https://wa.me/${SITE_PHONES[0].tel.replace(/\D/g, "")}`;

export const SITE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Axis+Business+Centre,+Near+Marigold+Banquets,+Bhugaon,+Maharashtra+412115&output=embed";
