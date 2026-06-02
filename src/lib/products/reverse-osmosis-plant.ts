import { siteImages } from "@/lib/site-images";

export const REVERSE_OSMOSIS_PLANT = {
  title: "Reverse Osmosis Plant",
  intro:
    "KHM Infra Innovations designs and delivers reverse osmosis (RO) plants for drinking water, industrial process water, brackish water desalination, and wastewater reuse. Our RO systems use high-rejection membranes to remove dissolved salts, ions, and contaminants, producing reliable, high-purity water tailored to your application.",
  heroImages: {
    main: siteImages.iot,
    secondary: [siteImages.waterRecycle, siteImages.heroPlant],
  },
  valueProposition:
    "Get an expert to plan, build, operate and maintain your water, wastewater, reuse, desalination, and waste-to-energy.",
  valueImages: [siteImages.etp, siteImages.engineers],
  detailBlocks: [
    {
      num: "01",
      title: "Pre-treatment",
      body: "Pre-treatment protects RO membranes by removing suspended solids, turbidity, iron, chlorine, and scaling agents. Typical stages include multimedia filtration, activated carbon filtration, antiscalant dosing, and cartridge filters to ensure stable feed water quality and extended membrane life.",
    },
    {
      num: "02",
      title: "The Process",
      body: "Feed water is pressurized by high-pressure pumps and passed through semi-permeable RO membranes. Pure water (permeate) passes through the membrane while dissolved salts and contaminants are rejected and discharged as concentrate. The system operates continuously with automated controls for pressure, flow, and quality monitoring.",
    },
    {
      num: "03",
      title: "Features",
      bullets: [
        "Compact design",
        "Low maintenance",
        "High quality components",
        "Easy operation",
        "High recovery rate up to 75–80%",
      ],
    },
    {
      num: "04",
      title: "Applications",
      bullets: [
        "Drinking water purification",
        "Industrial process water",
        "Brackish water desalination",
        "Seawater desalination",
        "Wastewater reuse",
      ],
    },
  ],
  plantsOffered: [
    { image: siteImages.iot, alt: "Outdoor reverse osmosis plant under shed" },
    { image: siteImages.waterTreatmentB, alt: "Indoor RO system with pressure vessels and pumps" },
    { image: siteImages.waterTreatmentC, alt: "Containerized RO plant with filter housings" },
    { image: siteImages.waterRecycle, alt: "Large-scale industrial RO membrane installation" },
  ],
  faqs: [
    {
      question: "What is a reverse osmosis (RO) plant?",
      answer:
        "A reverse osmosis plant is a water treatment system that uses semi-permeable membranes and high pressure to remove dissolved salts, ions, and most contaminants from water, producing purified permeate suitable for drinking, industrial use, or reuse.",
    },
    {
      question: "How does a reverse osmosis plant work?",
      answer:
        "Water is pre-treated and pumped at high pressure through RO membranes. Water molecules pass through as permeate while dissolved solids are retained and flushed away as reject or concentrate. Post-treatment such as remineralization or disinfection may follow depending on end use.",
    },
    {
      question: "What are the advantages of using reverse osmosis water?",
      answer:
        "RO water is free from most dissolved salts and impurities, improves product quality in industries, protects boilers and equipment from scaling, supports regulatory compliance, and provides a consistent source of high-purity water for critical applications.",
    },
    {
      question: "What are the different types of reverse osmosis plants?",
      answer:
        "RO plants vary by capacity, feed water type (brackish or seawater), configuration (single-pass or double-pass), and automation level. Systems can be skid-mounted, containerized, or custom-built for municipal, commercial, and industrial installations.",
    },
    {
      question: "What are the main applications of reverse osmosis water?",
      answer:
        "Applications include potable water production, pharmaceutical and beverage manufacturing, boiler feed water, semiconductor and laboratory use, desalination, and tertiary treatment for wastewater recycling.",
    },
    {
      question: "How often does the membrane need to be replaced?",
      answer:
        "RO membrane life typically ranges from 3 to 7 years depending on feed water quality, pre-treatment effectiveness, operating pressure, and cleaning frequency. Proper pre-treatment and regular CIP extend membrane performance and service life.",
    },
    {
      question: "Can reverse osmosis remove water with high TDS level?",
      answer:
        "Yes, RO is specifically designed to reduce high total dissolved solids (TDS). Removal efficiency depends on membrane type, system design, and operating conditions. For very high TDS sources such as seawater, specialized membranes and multi-stage designs are used.",
    },
  ],
} as const;
