import { engineers, etp, govt, heroPlant, iot, rainwater, smartCity, waterRecycle } from "@/lib/images";
import { siteImages } from "@/lib/site-images";
import type { GallerySectionId } from "@/lib/gallery-sections";

export const GALLERY_HERO = {
  titleLine1: "KHM Infra's Gallery",
  titleLine2: "Capturing Our Journey",
  subtitle: "RELIVE OUR JOURNEY: MEMORABLE MOMENTS IN OUR CORPORATE GALLERY.",
  image: siteImages.galleryHero,
} as const;

export type GalleryItem = {
  src: string;
  caption: string;
  alt: string;
};

export const GALLERY_ITEMS: Record<GallerySectionId, GalleryItem[]> = {
  infrastructure: [
    { src: engineers, caption: "Nozzle Cutting", alt: "Worker performing nozzle cutting on pipe" },
    { src: etp, caption: "Grinding", alt: "Worker grinding metal with sparks" },
    { src: govt, caption: "Shell Welding", alt: "Shell welding inside cylindrical vessel" },
    { src: iot, caption: "CNC Cutting", alt: "CNC cutting machine operation" },
  ],
  festivals: [
    { src: engineers, caption: "Team Celebration", alt: "Team at corporate event" },
    { src: smartCity, caption: "Annual Day", alt: "Annual day celebration" },
    { src: waterRecycle, caption: "Festival Gathering", alt: "Festival gathering at facility" },
    { src: etp, caption: "Cultural Event", alt: "Cultural event at workplace" },
  ],
};

export const GALLERY_CTA = {
  title: "Are you ready for a better more productive business?",
  body: "Stop worrying about treatment solution for water & wastewater. Focus on your business. Let us provide the solution you deserve.",
  button: "Get a Quote",
} as const;
