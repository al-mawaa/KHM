import { siteImages } from "@/lib/site-images";

export const CLARIFIER_SYSTEM = {
  title: "Clarifier System",
  intro:
    "KHM Infra Innovations offers a wide range of clarifier systems for both small and large scale applications. Our clarifier systems are designed to provide efficient and cost-effective removal of suspended solids from water and wastewater. We offer a variety of clarifier types, including circular, rectangular, and lamella clarifiers, to meet the specific needs of our customers.",
  heroImages: {
    main: siteImages.etp,
    secondary: [siteImages.heroPlant, siteImages.waterRecycle],
  },
  technologies: {
    heading: "Technologies We Offer",
    items: [
      "High Rate Solid Contact Clarifier (HRSCC)",
      "Tube Settler (TS)",
      "Clariflocculator",
      "Lamella Settler",
    ],
    tagline:
      "We offer the quality and technical expertise to provide customized solutions for each and every water treatment challenge.",
    images: [siteImages.engineers, siteImages.iot],
  },
  processSteps: [
    {
      num: "01",
      title: "Coagulation",
      body: "Coagulation is the chemical process of adding coagulants to destabilize suspended particles in water, allowing them to aggregate and prepare for removal in subsequent treatment stages.",
    },
    {
      num: "02",
      title: "Flocculation",
      body: "Flocculation is the physical process of gentle mixing that brings destabilized particles together to form larger, settleable flocs that can be removed efficiently during sedimentation.",
    },
    {
      num: "03",
      title: "Sedimentation",
      bullets: [
        "Gravity settling of flocs to the bottom of the clarifier tank.",
        "Reduction of BOD, COD, and suspended solids in the water.",
        "Clarified water collection from the top overflow weir.",
        "Sludge removal from the bottom for further treatment or disposal.",
      ],
    },
    {
      num: "04",
      title: "Filtration",
      bullets: [
        "Final polishing of clarified water before distribution or reuse.",
        "Removal of remaining fine particles and turbidity.",
        "Ensures high-quality treated water meeting project specifications.",
      ],
    },
  ],
  systemsOffered: [
    {
      title: "High Rate Solid Contact Clarifier (HRSCC)",
      image: siteImages.heroPlant,
    },
    {
      title: "Tube Settler (TS)",
      image: siteImages.govt,
    },
    {
      title: "Clariflocculator",
      image: siteImages.waterRecycle,
    },
    {
      title: "Lamella Settler",
      image: siteImages.etp,
    },
  ],
  faqs: [
    {
      question: "What is the purpose of a clarifier system?",
      answer:
        "A clarifier system removes suspended solids, turbidity, and settleable particles from water or wastewater through sedimentation. It improves water clarity before filtration, disinfection, or reuse and is essential in municipal, industrial, and process water treatment plants.",
    },
    {
      question: "How does a clarifier system work?",
      answer:
        "Water enters the clarifier after coagulation and flocculation. Heavier flocs settle to the bottom by gravity while clarified water flows over weirs at the top. Collected sludge is withdrawn periodically, and clarified effluent moves to the next treatment stage such as filtration or disinfection.",
    },
    {
      question: "What are the different types of clarifiers?",
      answer:
        "Common types include circular clarifiers, rectangular clarifiers, lamella (plate) settlers, tube settlers, high-rate solid contact clarifiers (HRSCC), and clariflocculators. The choice depends on flow rate, land availability, raw water quality, and project budget.",
    },
    {
      question: "What are the components of a clarifier system?",
      answer:
        "Typical components include an inlet well, flash mixer, flocculation zone, settling zone, sludge collection mechanism, scum removal system, overflow weirs, sludge withdrawal pumps, and associated piping, valves, and instrumentation for level and flow control.",
    },
    {
      question: "What are the maintenance requirements for a clarifier system?",
      answer:
        "Regular maintenance includes sludge removal, cleaning of weirs and launder channels, inspection of scraper mechanisms, calibration of instruments, checking pump performance, and periodic desludging. Preventive maintenance ensures consistent effluent quality and extends equipment life.",
    },
    {
      question: "How do I choose the right clarifier system for my project?",
      answer:
        "Selection depends on inlet water quality, required outlet standards, peak and average flow rates, available footprint, automation level, and operating cost. KHM Infra Innovations provides engineering consultation to recommend the most suitable clarifier type for your application.",
    },
    {
      question: "How much does it cost to install a clarifier system?",
      answer:
        "Cost varies with capacity, material of construction, automation, civil works, and site conditions. Contact our team with your flow rate, water quality data, and project location for a customized quotation and technical proposal.",
    },
  ],
} as const;
