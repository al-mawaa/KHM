import { siteImages } from "@/lib/site-images";

export const SEAWATER_DESALINATION_PLANT = {
  title: "Sea Water RO Desalination Treatment Plant",
  intro:
    "Our sea water RO desalination treatment plant is designed to provide clean, potable water from seawater using advanced reverse osmosis technology. KHM Infra Innovations delivers reliable SWRO systems that remove dissolved salts and minerals to produce water suitable for drinking, industrial use, and community supply in coastal and island regions.",
  heroImage: siteImages.govt,
  valueImages: [siteImages.engineers, siteImages.iot],
  detailBlocks: [
    {
      num: "01",
      title: "Process Description",
      body: "Seawater desalination using reverse osmosis involves intake screening, pre-treatment to remove suspended solids and biological growth, high-pressure pumping through RO membranes to separate salt and minerals, and post-treatment for pH adjustment and disinfection. The result is clean water suitable for human consumption or industrial applications.",
    },
    {
      num: "02",
      title: "Key Features",
      body: "Our SWRO plants incorporate high-rejection seawater membranes, energy recovery devices to reduce power consumption, corrosion-resistant materials for marine environments, and fully automated PLC-based control systems for continuous monitoring of pressure, flow, salinity, and plant performance.",
    },
    {
      num: "03",
      title: "Features",
      body: "Engineered for energy efficiency and long-term reliability, our desalination systems offer cost-effective operation, modular and scalable design, robust construction for harsh coastal conditions, and low maintenance requirements with remote monitoring capabilities.",
    },
    {
      num: "04",
      title: "Application",
      body: "Sea water RO desalination plants serve coastal communities, hotels and resorts, offshore platforms, naval and marine facilities, industrial process water supply, irrigation in arid coastal zones, and emergency potable water production where freshwater sources are limited.",
    },
  ],
  faqs: [
    {
      question: "What is an SWRO desalination plant?",
      answer:
        "An SWRO (Sea Water Reverse Osmosis) desalination plant is a treatment facility that converts seawater into fresh, potable water by forcing seawater through high-pressure RO membranes that reject dissolved salts, minerals, and most contaminants.",
    },
    {
      question: "How does an SWRO desalination plant work?",
      answer:
        "Seawater is drawn through intake structures, pre-treated to protect membranes, pressurized by high-pressure pumps, and passed through RO membrane arrays. Permeate is collected as fresh water while concentrated brine is safely discharged. Post-treatment ensures water meets drinking or process quality standards.",
    },
    {
      question: "What are the advantages of SWRO desalination plants?",
      answer:
        "SWRO provides an independent freshwater source in water-scarce coastal areas, produces consistent water quality, reduces dependence on groundwater or surface supplies, and supports sustainable development for communities, tourism, and industry near the sea.",
    },
    {
      question: "Are SWRO desalination plants environmentally friendly?",
      answer:
        "Modern SWRO plants use energy recovery systems to minimize power use, employ proper brine discharge practices to reduce environmental impact, and integrate pre-treatment to protect marine ecosystems. Responsible design and compliance with environmental regulations ensure sustainable operation.",
    },
    {
      question: "What is the cost of building an SWRO desalination plant?",
      answer:
        "Cost depends on daily capacity, feed water salinity, energy costs, civil works, intake and outfall structures, and automation level. Contact KHM Infra Innovations with your location, required output, and water quality targets for a detailed project quotation.",
    },
  ],
} as const;
