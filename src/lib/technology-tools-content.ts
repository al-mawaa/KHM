import { siteImages } from "@/lib/site-images";

export type ToolCategoryVariant = "blue" | "green";

export type ToolCategory = {
  id: string;
  title: string;
  tools: string[];
  image: string;
  variant: ToolCategoryVariant;
};

export const TECHNOLOGY_TOOLS = {
  title: "Technology & Tools",
  intro:
    "KHM Infra Innovations uses industry-leading hydraulic modelling, survey, design, and GIS platforms to deliver accurate planning, detailed engineering, and data-driven project delivery.",
  categories: [
    {
      id: "hydraulic",
      title: "Hydraulic Modelling Software",
      tools: [
        "WaterGEMS / WaterCAD (Bentley OpenFlows)",
        "SewerGEMS / OpenFlows Sewer Standard",
        "EPANET Water Distribution Modelling",
        "KY Pipe / Water Work Suite",
      ],
      image: siteImages.waterTreatmentHero,
      variant: "blue",
    },
    {
      id: "survey",
      title: "Survey & Mapping Tools",
      tools: [
        "Drone UAV (Kingfisher 30) — Aerial & Topographic",
        "Leica / Nikon DGPS & GPS Units",
        "Total Station — Angular & Distance Measurement",
        "Echo Sounder — Bathymetric Surveys",
      ],
      image: siteImages.smartCity,
      variant: "green",
    },
    {
      id: "design",
      title: "Design & Drafting Software",
      tools: [
        "ZWCAD 2025 Standard & Standalone",
        "E Survey Titanium",
        "Global Mapper 20.1",
        "AutoCAD Civil & Structural Design",
      ],
      image: siteImages.engineers,
      variant: "blue",
    },
    {
      id: "gis",
      title: "GIS & Remote Sensing",
      tools: [
        "GIS Mapping & Spatial Analysis",
        "DEM & Contour Generation",
        "Satellite Imagery Processing",
        "Drone Data Processing (Point Clouds)",
      ],
      image: siteImages.iot,
      variant: "blue",
    },
  ] satisfies ToolCategory[],
  cta: {
    title: "Need engineering backed by the right tools?",
    button: "Contact Us",
  },
} as const;
