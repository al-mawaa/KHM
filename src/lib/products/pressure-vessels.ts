import { siteImages } from "@/lib/site-images";

export const PRESSURE_VESSELS = {
  title: "Pressure Vessels",
  intro:
    "Pressure vessels are containers designed to hold gases or liquids at a pressure substantially different from ambient pressure. KHM Infra Innovations designs, fabricates, and supplies pressure vessels for industrial, power, chemical, and water treatment applications in compliance with applicable codes and safety standards.",
  heroImages: {
    main: siteImages.waterTreatmentB,
    secondary: [siteImages.engineers, siteImages.waterTreatmentC],
  },
  valueProposition:
    "Pressure vessels are used in many industrial applications and are designed to meet specific requirements and safety standards of your industry.",
  valueImages: [siteImages.rainwater, siteImages.govt],
  detailBlocks: [
    {
      num: "01",
      title: "Design and Fabrication",
      body: "We provide custom design and fabrication of pressure vessels according to industry standards and project specifications. Our engineering team prepares detailed drawings, material specifications, and welding procedures to ensure structural integrity and performance.",
    },
    {
      num: "02",
      title: "Testing and Inspection",
      body: "All vessels undergo rigorous testing and inspection including hydrostatic testing, non-destructive examination, and dimensional verification. Quality control documentation is provided for client review and regulatory compliance.",
    },
    {
      num: "03",
      title: "Installation",
      body: "Our team supports installation at site with proper alignment, nozzle orientation, support structures, and connection to piping systems. We ensure vessels are commissioned safely and in accordance with design requirements.",
    },
    {
      num: "04",
      title: "Maintenance",
      body: "We offer maintenance guidance and service support including periodic inspection schedules, corrosion monitoring, relief device testing, and repair recommendations to extend vessel life and maintain safe operation.",
    },
  ],
  vesselsOffered: [
    { image: siteImages.etp, alt: "Industrial pressure vessel installation" },
    { image: siteImages.heroPlant, alt: "Water treatment plant with vessels" },
    { image: siteImages.waterRecycle, alt: "Treatment channel and piping" },
    { image: siteImages.smartCity, alt: "Large-scale industrial facility" },
  ],
  faqs: [
    {
      question: "How often should pressure vessels be inspected and maintained?",
      answer:
        "Inspection frequency depends on service conditions, code requirements, and local regulations. Typically, internal and external inspections are performed annually or as specified in the operating permit and manufacturer recommendations.",
    },
    {
      question: "How do I know if my pressure vessel in treatment system needs to be replaced?",
      answer:
        "Signs include excessive corrosion, wall thinning beyond allowable limits, recurring leaks, failed hydrostatic tests, or inability to meet design pressure. A qualified inspector can assess remaining life and recommend repair or replacement.",
    },
    {
      question: "What safety precautions should be taken when working with pressure vessels?",
      answer:
        "Always depressurize before opening, use appropriate PPE, follow lockout/tagout procedures, never exceed design pressure, ensure relief devices are functional, and train personnel on safe operating and maintenance practices.",
    },
    {
      question: "What are the regulations and standards for pressure vessels?",
      answer:
        "Pressure vessels are governed by codes such as ASME BPVC, IS standards, and factory regulations in India. Compliance includes design approval, fabrication documentation, periodic inspection, and registration where required.",
    },
    {
      question: "What are the common types of pressure vessels?",
      answer:
        "Common types include storage tanks, process reactors, heat exchangers, columns, separators, air receivers, and custom vessels for specific chemical or water treatment processes.",
    },
  ],
} as const;
