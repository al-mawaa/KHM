import { siteImages } from "@/lib/site-images";

export type ServiceCategory = {
  id: string;
  title: string;
  services: string[];
  image: string;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "water-missions",
    title: "Jal Jeevan Mission & AMRUT 2.0 Projects",
    services: [
      "Jal Jeevan Mission — Rural & Urban Water Supply",
      "AMRUT 2.0 Projects",
      "24×7 Drinking Water Systems",
      "Industrial Water Supply",
    ],
    image: siteImages.rainwater,
  },
  {
    id: "sewerage",
    title: "Sewerage & Wastewater Management",
    services: [
      "Sewerage Network Planning & Design",
      "Sewage Treatment Plant (STP) Design",
      "Effluent Treatment Plant (ETP) Design",
      "Used Water Management under SBM 2.0",
      "Sewer Network Modelling (SewerGEMS)",
      "Industrial Wastewater Solutions",
      "River Pollution Abatement Studies",
    ],
    image: siteImages.etp,
  },
  {
    id: "civil",
    title: "Civil Infrastructure",
    services: [
      "Roads, Bridges & Flyover DPR Design",
      "Structural Design & Detailing",
      "Solid Waste Management Systems",
      "Park, Lake & Riverfront Development",
      "Drainage & Stormwater Management",
      "Urban Development & Smart City Projects",
      "Industrial Infrastructure Planning",
    ],
    image: siteImages.govt,
  },
  {
    id: "irrigation",
    title: "Irrigation Engineering",
    services: [
      "Irrigation Canal & Distribution Network Design",
      "Command Area Survey & Planning",
      "Lift Irrigation Schemes",
      "Dam Survey & DPR Preparation",
      "Pipeline Distribution Network (PDN)",
      "Underground Pipeline Systems (UGPL)",
      "Water Resource Master Plans",
    ],
    image: siteImages.waterRecycle,
  },
  {
    id: "real-estate",
    title: "Real Estate Development",
    services: [
      "Residential Township Planning & Design",
      "Commercial Complex Development",
      "Integrated Township Infrastructure Services",
      "Water & Sanitation Services for Housing",
      "Site Development & Layout Planning",
      "Building Services & MEP Design",
      "RERA Compliance & Documentation",
    ],
    image: siteImages.smartCity,
  },
  {
    id: "power",
    title: "Power Sector",
    services: [
      "Solar & Renewable Energy Project DPRs",
      "Power Distribution Network Design",
      "Electrical Infrastructure for Industrial Areas",
      "Captive Power Plant Planning",
      "Energy Audit & Conservation Studies",
      "Street Lighting & Smart Grid Design",
      "Industrial Power Infrastructure",
    ],
    image: siteImages.iot,
  },
  {
    id: "pmc",
    title: "Project Management (PMC)",
    services: [
      "PMC — Concept to Commissioning",
      "Tender Documentation & Bid Management",
      "Construction Supervision & Monitoring",
      "Contract Administration",
      "Third-Party Inspection (TPIA)",
      "Quality Control & Energy Audits",
      "Statutory Compliance Management",
    ],
    image: siteImages.engineers,
  },
  {
    id: "om-amc",
    title: "O&M & AMC Services",
    services: [
      "Water Supply System O&M",
      "Sewerage & STP Operation",
      "Infrastructure Asset Management",
      "Preventive & Corrective Maintenance",
      "Performance Monitoring & Benchmarking",
      "Staff Training & Capacity Building",
      "Smart Monitoring System Integration",
    ],
    image: siteImages.heroPlant,
  },
];

export const SERVICES_PAGE = {
  title: "Our Services",
  intro:
    "KHM Infra Innovations provides end-to-end infrastructure and engineering services — from government mission projects and sewerage systems to civil works, irrigation, real estate, power, PMC, and long-term O&M.",
  cta: {
    title: "Discuss your project requirements",
    button: "Get a Quote",
  },
} as const;
