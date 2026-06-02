import { siteImages } from "@/lib/site-images";

export const SURGE_VESSEL = {
  title: "Surge Vessel / Air Vessel",
  intro: [
    "Surge vessels are critical equipment used to control pressure surges and water hammer in fluid transmission systems. They provide an air or gas cushion that absorbs sudden changes in flow and pressure, protecting pipelines, pumps, and valves from damage.",
    "KHM Infra Innovations designs and supplies high-quality surge vessels and air vessels for water supply networks, industrial pipelines, and process plants — engineered for reliability, safety, and long service life.",
  ],
  heroImages: {
    main: siteImages.waterTreatmentB,
    secondary: [siteImages.engineers, siteImages.waterTreatmentC],
  },
  types: {
    heading: "Types of Surge Vessel",
    items: ["Bladder type Surge Vessel", "Compressor Type Surge Vessel"],
    images: [siteImages.rainwater, siteImages.waterRecycle],
  },
  detailBlocks: [
    {
      num: "01",
      title: "Product Description",
      body: "KHM Infra Innovations is a leading manufacturer and exporter of surge vessels and air vessels. Our products are built with high-quality materials, tested for pressure integrity, and supplied with complete documentation for installation and commissioning.",
    },
    {
      num: "02",
      title: "Functionality",
      body: "The surge vessel manages pressure surges and water hammer by providing a cushion of compressed air or gas. When pressure waves travel through the pipeline, the vessel absorbs energy and dampens fluctuations, extending system lifespan and reducing the risk of pipe rupture or equipment failure.",
    },
    {
      num: "03",
      title: "Features",
      bullets: [
        "High-quality material construction",
        "High-pressure resistance",
        "Various sizes and capacities",
        "Low maintenance",
        "Easy installation",
        "Corrosion-resistant coating",
      ],
    },
    {
      num: "04",
      title: "Applications",
      bullets: [
        "Oil and gas pipelines",
        "Water treatment plants",
        "Chemical plants",
        "Power plants",
        "Mining industry",
      ],
    },
  ],
  vesselsOffered: [
    { image: siteImages.waterTreatmentC, alt: "Blue vertical surge vessel" },
    { image: siteImages.iot, alt: "Grey vertical surge vessels installation" },
  ],
  faqs: [
    {
      question: "What is a surge vessel and what is it used for?",
      answer:
        "A surge vessel is a pressure vessel used to control pressure surges and water hammer in piping systems. It protects pipelines and equipment by absorbing sudden pressure changes during pump start/stop or valve operations.",
    },
    {
      question: "How does a surge vessel work?",
      answer:
        "The vessel contains a cushion of air or gas. When a pressure wave enters the system, the cushion compresses and absorbs energy, damping the surge before it can damage downstream piping or equipment.",
    },
    {
      question: "What are the different types of surge vessels?",
      answer:
        "Common types include bladder-type surge vessels with a flexible membrane separating water and air, and compressor-type vessels where air pressure is maintained by an external compressor system.",
    },
    {
      question: "What are the advantages of using a surge vessel?",
      answer:
        "Advantages include pipeline protection, reduced maintenance and repair costs, improved system stability, extended equipment life, and compliance with hydraulic design standards for long-distance water transmission.",
    },
    {
      question: "How is a surge vessel maintained?",
      answer:
        "Maintenance includes periodic inspection of vessel pressure, checking bladder or compressor systems, verifying relief valves and instrumentation, and structural inspection of supports and nozzles per manufacturer guidelines.",
    },
    {
      question: "How long does a surge vessel last?",
      answer:
        "With proper maintenance and correct operating conditions, surge vessels typically last many years. Bladder replacement and repainting may be required periodically depending on environment and service.",
    },
    {
      question: "How is surge vessel sizing calculated?",
      answer:
        "Sizing is based on pipeline flow rate, length, diameter, elevation profile, allowable pressure variation, and pump characteristics. Hydraulic transient analysis is used to determine required vessel volume and initial air cushion pressure.",
    },
    {
      question: "What are safety precautions for surge vessels?",
      answer:
        "Follow manufacturer instructions, use appropriate PPE, depressurize before maintenance, never exceed design pressure, ensure relief devices are functional, and train personnel on safe operation of compressed air systems.",
    },
  ],
} as const;
