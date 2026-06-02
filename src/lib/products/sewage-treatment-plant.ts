import { siteImages } from "@/lib/site-images";

export const SEWAGE_TREATMENT_PLANT = {
  title: "Sewage Treatment Plant (STP)",
  intro:
    "A sewage treatment plant (STP) is a facility designed to remove contaminants from wastewater or sewage. KHM Infra Innovations provides complete STP solutions for residential complexes, commercial buildings, municipalities, and industrial campuses using proven biological and physical treatment technologies.",
  heroImages: {
    main: siteImages.etp,
    secondary: [siteImages.govt, siteImages.waterTreatmentC],
  },
  componentsHeading: "Our STP systems include:",
  components: [
    "Bar Screen Chamber",
    "Oil and Grease Trap (OGT)",
    "Equalization Tank (EQ)",
    "Fluidized Bed Reactor (FBR)",
    "Sludge Holding Tank (SHT)",
    "Clarifier/Tube Settler (TS)",
    "Multi-Grade Sand Filter (MGF)",
    "Activated Carbon Filter (ACF)",
    "Chlorine Contact Tank (CCT) / UV / Ozone",
  ],
  technologies: {
    heading: "Technologies We Offer",
    items: [
      "Moving Bed Biofilm Reactor (MBBR)",
      "Membrane Bio-Reactor (MBR)",
      "Sequential Batch Reactor (SBR)",
      "Submerged Aerated Fixed Film (SAFF)",
    ],
    typesHeading: "Types Of STP",
    types: ["Packaged STP", "Containerized STP", "Civil STP"],
    images: [siteImages.heroPlant, siteImages.waterRecycle],
  },
  processSteps: [
    {
      num: "01",
      title: "Primary Treatment",
      body: "Primary treatment is the physical process of removing large solids, grit, and grease from sewage through screening, grit removal, and sedimentation. This stage protects downstream biological treatment units and reduces organic load on secondary processes.",
    },
    {
      num: "02",
      title: "Secondary Treatment",
      body: "Secondary treatment is the biological process where microorganisms break down organic matter in wastewater. Technologies such as MBBR, MBR, SBR, and SAFF convert dissolved and suspended organics into stable solids that can be separated in clarifiers.",
    },
    {
      num: "03",
      title: "Tertiary Treatment",
      bullets: [
        "Removal of nutrients",
        "Disinfection processes",
        "Advanced filtration",
        "Phosphorus removal",
        "Nitrogen removal",
        "UV disinfection",
      ],
    },
    {
      num: "04",
      title: "Sludge Treatment",
      bullets: [
        "Thickening and dewatering",
        "Digestion (Aerobic/Anaerobic)",
        "Drying and disposal",
        "Resource recovery (biogas)",
      ],
    },
  ],
  plantsOffered: [
    { image: siteImages.waterTreatmentC, alt: "Blue modular STP tanks" },
    { image: siteImages.smartCity, alt: "Containerized sewage treatment plant" },
    { image: siteImages.rainwater, alt: "Cylindrical STP vessels" },
    { image: siteImages.etp, alt: "Outdoor STP facility with piping" },
  ],
  faqs: [
    {
      question: "What is the use of a sewage treatment plant?",
      answer:
        "A sewage treatment plant treats domestic and commercial wastewater to remove pollutants before safe discharge or reuse. It protects public health, prevents water body contamination, and supports compliance with pollution control regulations.",
    },
    {
      question: "How does a sewage treatment plant work?",
      answer:
        "STP works through primary physical treatment, secondary biological treatment, tertiary polishing, and sludge handling. Wastewater flows through screening, equalization, biological reactors, clarification, filtration, and disinfection stages.",
    },
    {
      question: "What are the different technologies used in sewage treatment plants?",
      answer:
        "Common technologies include MBBR, MBR, SBR, SAFF, activated sludge process, and extended aeration systems. Selection depends on inlet load, outlet standards, land availability, and operating preferences.",
    },
    {
      question: "What are the key components of a sewage plant?",
      answer:
        "Key components include bar screens, oil and grease traps, equalization tanks, aeration or bio-reactor units, clarifiers, filters, disinfection systems, sludge holding and dewatering equipment, and control panels.",
    },
    {
      question: "What are the main types of sewage treatment?",
      answer:
        "Sewage treatment is classified into primary, secondary, tertiary, and sludge treatment stages. STP configurations include packaged, containerized, and civil-built plants based on capacity and site requirements.",
    },
    {
      question: "Are there any maintenance requirements for a sewage treatment plant?",
      answer:
        "Regular maintenance includes blower and pump servicing, sludge removal, media inspection, calibration of instruments, filter backwashing, and periodic cleaning of reactors and clarifiers to ensure consistent effluent quality.",
    },
    {
      question: "How much space is required for installing a sewage treatment plant?",
      answer:
        "Space requirements depend on daily flow, treatment technology, and local norms. Packaged and containerized STPs need less footprint than civil plants. KHM provides layout drawings based on your project capacity and site survey.",
    },
  ],
} as const;
