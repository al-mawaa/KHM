import { siteImages } from "@/lib/site-images";

export const ULTRA_FILTRATION_PLANT = {
  title: "Ultra Filtration Plant",
  intro:
    "An ultra filtration (UF) plant uses semi-permeable membranes with pore sizes typically ranging from 0.01 to 0.1 microns to remove suspended solids, bacteria, viruses, and other pathogens from water while allowing water molecules and dissolved minerals to pass through. KHM Infra Innovations delivers reliable UF systems for municipal, industrial, and process water applications.",
  heroImages: {
    main: siteImages.heroPlant,
    secondary: [siteImages.iot, siteImages.engineers],
  },
  valueProposition:
    "Ultra filtration plants are used to remove suspended solids, bacteria, viruses and other pathogens from water.",
  valueImages: [siteImages.waterTreatmentA, siteImages.waterRecycle],
  detailBlocks: [
    {
      num: "01",
      title: "Pre-treatment",
      body: "Pre-treatment is the initial stage where large particles, turbidity, and debris are removed through sedimentation, screening, or media filtration. This protects the UF membrane from fouling and extends membrane life while ensuring stable plant performance.",
    },
    {
      num: "02",
      title: "UF Membrane",
      body: "Pre-treated water is pumped through ultrafiltration membrane modules made of PES (polyethersulfone) or PVDF (polyvinylidene fluoride) under controlled pressure. Contaminants are trapped on the membrane surface while purified water passes through as permeate.",
    },
    {
      num: "03",
      title: "Backwash",
      bullets: [
        "Automatic backwash",
        "High cleaning efficiency",
        "Low maintenance and long life",
        "Easy to install and operate",
        "High-quality water production",
        "Reduced chemical consumption",
        "Improved system reliability and performance",
      ],
    },
    {
      num: "04",
      title: "CIP System",
      bullets: [
        "Chemical cleaning system for membranes",
        "Automatic control",
        "High cleaning efficiency and long life",
        "Easy to install and operate",
        "Reduced chemical consumption",
        "Improved system reliability",
        "Environmentally friendly",
      ],
    },
  ],
  plantsOffered: [
    { image: siteImages.heroPlant, alt: "Ultrafiltration module installation" },
    { image: siteImages.iot, alt: "UF plant control and piping" },
    { image: siteImages.waterTreatmentC, alt: "Industrial ultrafiltration system" },
    { image: siteImages.engineers, alt: "UF membrane skid assembly" },
  ],
  faqs: [
    {
      question: "What is the purpose of an ultrafiltration plant?",
      answer:
        "An ultrafiltration plant removes suspended solids, colloids, bacteria, viruses, and other microbiological contaminants from water. It is used to produce safe process water, pre-treat feed for reverse osmosis, and meet stringent water quality standards.",
    },
    {
      question: "How does an ultrafiltration plant work?",
      answer:
        "Water is pressurized and passed through hollow-fiber or spiral-wound UF membranes. Particles larger than the membrane pore size are retained while clean water permeates through. Periodic backwashing and chemical cleaning (CIP) maintain membrane flux and performance.",
    },
    {
      question: "What are the different types of ultrafiltration plants?",
      answer:
        "UF plants are available in dead-end and cross-flow configurations, with hollow-fiber, tubular, or spiral-wound modules. Systems can be manual, semi-automatic, or fully automatic depending on flow rate and application requirements.",
    },
    {
      question: "What are the applications of an ultrafiltration plant?",
      answer:
        "Applications include drinking water treatment, pretreatment for RO and demineralization, wastewater reuse, pharmaceutical and food processing water, boiler feed water, and tertiary treatment in sewage and effluent plants.",
    },
    {
      question: "What are the advantages of an ultrafiltration plant?",
      answer:
        "UF offers consistent removal of pathogens and turbidity without heavy chemical dosing, compact footprint, lower energy use compared to RO, high recovery rates, and reliable operation with automated backwash and cleaning cycles.",
    },
  ],
} as const;
