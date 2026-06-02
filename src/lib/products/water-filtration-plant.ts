import { siteImages } from "@/lib/site-images";

export const WATER_FILTRATION_PLANT = {
  title: "Water Filtration Plant",
  intro:
    "Water filtration plants are designed to remove impurities such as sand, silt, clay, and organic matter from raw water to provide high-quality water suitable for drinking, industrial processes, and other applications. KHM Infra Innovations delivers efficient filtration systems engineered for consistent performance, easy operation, and long service life.",
  heroImages: {
    main: siteImages.waterRecycle,
    secondary: [siteImages.iot, siteImages.heroPlant],
  },
  valueProposition:
    "The important thing is that under our utilization of maximum surface area and accuracy in knowing the pressure drops. This is how very valuable step build columns and at the same time quite easy cleaning of different removal of impurities.",
  valueImages: [siteImages.waterTreatmentC, siteImages.waterTreatmentB],
  detailBlocks: [
    {
      num: "01",
      title: "High Performance",
      body: "Our High Rate Sand Filter (HRSF) systems are designed for maximum surface area utilization, delivering efficient filtration with optimized flow distribution and minimal pressure loss across the filter bed for reliable day-to-day operation.",
    },
    {
      num: "02",
      title: "High Reliability",
      body: "Built with robust materials and proven engineering practices, our water filtration plants offer durability, low maintenance requirements, and extended service life — ensuring dependable treatment performance across municipal and industrial applications.",
    },
    {
      num: "03",
      title: "Features",
      bullets: [
        "Efficient filtration down to 20–30 microns.",
        "High filtration rate.",
        "Operation at high pressure drop.",
        "Low operating cost.",
        "Filtered water is free from suspended matter such as sand, silt, clay, organic matter, etc.",
      ],
    },
    {
      num: "04",
      title: "Applications",
      bullets: [
        "Process water treatment.",
        "Pre-treatment for RO systems.",
        "Treatment of cooling water.",
        "Side stream filtration.",
        "Municipal water treatment.",
        "Wastewater treatment plant.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the purpose of a water filtration plant?",
      answer:
        "A water filtration plant removes suspended solids, turbidity, and particulate impurities from raw water to produce clear, safe water for drinking, industrial use, or as pre-treatment before advanced processes such as reverse osmosis or disinfection.",
    },
    {
      question: "How does a water filtration plant work?",
      answer:
        "Raw water passes through filter media such as sand, anthracite, or multi-layer beds. Suspended particles are trapped in the media while clarified water exits through an underdrain system. Periodic backwashing cleans the media and restores filtration capacity.",
    },
    {
      question: "What are the different types of water filtration plants?",
      answer:
        "Common types include pressure sand filters, gravity sand filters, dual-media filters, activated carbon filters, and high-rate sand filters (HRSF). Selection depends on raw water quality, required outlet standards, flow rate, and operating conditions.",
    },
    {
      question: "What are the key components of a water filtration plant?",
      answer:
        "Typical components include filter vessels, filter media, distribution systems, underdrain collectors, backwash pumps, valves, piping, pressure gauges, flow meters, and control panels for automated operation and backwash sequencing.",
    },
    {
      question: "What are the advantages of a water filtration plant?",
      answer:
        "Filtration improves water clarity, protects downstream equipment, reduces chemical consumption, supports regulatory compliance, and provides a cost-effective treatment stage for both municipal and industrial water systems.",
    },
    {
      question: "How do I know if my water filtration plant is working properly?",
      answer:
        "Monitor outlet turbidity, pressure differential across the filter, backwash frequency, and flow rates. Rising pressure drop or increasing turbidity indicate media fouling and the need for backwashing or maintenance.",
    },
    {
      question: "How much does it cost to install and maintain a water filtration plant?",
      answer:
        "Cost depends on capacity, filter type, automation level, civil works, and site conditions. Contact KHM Infra Innovations with your flow rate and water quality parameters for a customized quotation and maintenance plan.",
    },
  ],
} as const;
