import { siteImages } from "@/lib/site-images";

export type SectorVariant = "blue" | "green";

export type Sector = {
  id: string;
  label: string;
  title: string;
  services: string[];
  image: string;
  variant: SectorVariant;
};

export const SECTORS_WE_SERVE: Sector[] = [
  {
    id: "water",
    label: "WATER",
    title: "Water Supply",
    services: [
      "24×7 Drinking Water Systems",
      "Industrial Water Supply",
      "Jal Jeevan Mission",
      "AMRUT 2.0 Projects",
    ],
    image: siteImages.rainwater,
    variant: "blue",
  },
  {
    id: "sewer",
    label: "SEWER",
    title: "Sewerage & WW",
    services: [
      "Sewage Treatment Plants",
      "Wastewater Management",
      "SBM 2.0 Projects",
      "Used Water Systems",
    ],
    image: siteImages.etp,
    variant: "blue",
  },
  {
    id: "civil",
    label: "CIVIL",
    title: "Civil Infrastructure",
    services: [
      "Roads & Bridge Design",
      "Urban Development",
      "Solid Waste Management",
      "Lake / River Rejuvenation",
    ],
    image: siteImages.govt,
    variant: "green",
  },
  {
    id: "real",
    label: "REAL",
    title: "Real Estate",
    services: [
      "Township Planning",
      "Residential Complexes",
      "Commercial Infra",
      "Site Development",
    ],
    image: siteImages.smartCity,
    variant: "blue",
  },
  {
    id: "power",
    label: "POWER",
    title: "Power Sector",
    services: [
      "Solar & Renewable DPRs",
      "Power Distribution Design",
      "Industrial Power Planning",
      "Energy Audits",
    ],
    image: siteImages.iot,
    variant: "blue",
  },
  {
    id: "pmc",
    label: "PMC Services",
    title: "O&M & AMC",
    services: [
      "Infrastructure O&M",
      "Third-Party Inspection",
      "Asset Management",
      "Performance Audits",
    ],
    image: siteImages.engineers,
    variant: "green",
  },
];
