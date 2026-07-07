import { siteImages } from "@/lib/site-images";

/** Hero slide 1 — black banner list. */
export const HERO_WATER_ITEMS = [
  "Clarifier System",
  "Water Filtration Plant",
  "Water Softener Plant",
  "Ultra Filtration Plant",
  "Reverse Osmosis Plant",
  "Seawater Desalination Plant",
  "Demineralization Plant",
] as const;

/** Hero slide 2 — WTE reference list. */
export const HERO_WTE_ITEMS = [
  "Pure Water System",
  "Industrial RO Plant",
  "Water Softener Plant",
  "Waste Water Treatment Plant",
  "Effluent Treatment Plant",
] as const;

/** Hero slide 3 — wastewater. */
export const HERO_WASTE_ITEMS = [
  "Sewage Treatment Plant",
  "Effluent Treatment Plant",
  "Zero Liquid Discharge",
  "Water Treatment System",
  "Reverse Osmosis System",
] as const;

export type HeroSlideConfig = {
  id: string;
  title: string;
  items: readonly string[];
  theme: "black" | "micro" | "aqua" | "wide" | "gradient" | "blue";
};

export const HERO_SLIDES: HeroSlideConfig[] = [
  { id: "water-black", title: "Water Treatment Plant", items: HERO_WATER_ITEMS, theme: "black" },
  { id: "water-wte", title: "Water Treatment Plant", items: HERO_WTE_ITEMS, theme: "micro" },
  { id: "water-aqua", title: "Water Treatment Plant", items: HERO_WATER_ITEMS, theme: "aqua" },
  { id: "water-wide", title: "Water Treatment Plant", items: HERO_WATER_ITEMS, theme: "wide" },
  { id: "water-gradient", title: "Water Treatment Plant", items: HERO_WATER_ITEMS, theme: "gradient" },
  { id: "waste-water", title: "Waste Water Treatment", items: HERO_WASTE_ITEMS, theme: "blue" },
];

export const KEY_ASSETS = [
  { value: 19, suffix: "+", label: "Years Industry Experience", icon: "award" },
  { value: 5500, suffix: "+", label: "Projects Installed Worldwide", icon: "building" },
  { value: 2200, suffix: "+", label: "Happy Customers", icon: "users" },
  { value: 39, suffix: "+", label: "Countries Served", icon: "globe" },
  { value: 100, suffix: "K+", label: "Daily Treatment Capacity (L)", icon: "droplet" },
  { value: 250, suffix: "+", label: "Engineering Professionals", icon: "hard-hat" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "KHM delivered our municipal STP on time with excellent engineering quality and transparent project reporting throughout execution.",
    name: "Project Director",
    company: "Municipal Corporation",
  },
  {
    quote:
      "Their ETP and ZLD design helped us meet pollution board norms while reducing operating costs across our manufacturing lines.",
    name: "Plant Head",
    company: "Pharmaceutical Industry",
  },
  {
    quote:
      "Professional team with strong technical expertise. Our RO plant has been running efficiently since commissioning.",
    name: "Operations Manager",
    company: "Food Processing Industry",
  },
] as const;

export const CLIENT_NAMES = [
  "Tata",
  "L&T",
  "Reliance",
  "Mahindra",
  "Infosys",
  "Adani",
  "JSW",
  "BHEL",
  "ONGC",
  "Siemens",
] as const;

export const YOUTUBE_EMBED = "https://www.youtube.com/embed/dQw4w9WgXcQ";
