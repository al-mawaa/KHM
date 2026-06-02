import { siteImages } from "@/lib/site-images";

export const OIL_WATER_SEPARATOR = {
  title: "Oil Water Separator",
  intro:
    "Oil-water separators are devices used to remove oil and impurities from wastewater in industrial and commercial settings. They protect the environment, help facilities comply with discharge regulations, and prevent oil contamination from reaching municipal sewers or natural water bodies.",
  heroImage: siteImages.etp,
  valueProposition:
    "When liquid-liquid dispersion exists since the washing process out, feature is formed.",
  valueImages: [siteImages.waterTreatmentC, siteImages.waterRecycle],
  detailBlocks: [
    {
      num: "01",
      title: "Product Description",
      body: "An oil water separator removes free oil, grease, and hydrocarbons from wastewater through gravity separation, coalescing media, or plate pack technology. Treated water exits at reduced oil content suitable for downstream treatment or permitted discharge, while collected oil is skimmed for recovery or disposal.",
    },
    {
      num: "02",
      title: "Applications",
      bullets: [
        "Petrochemical and refineries",
        "Food and beverage processing",
        "Automotive and manufacturing",
        "Power generation plants",
        "Steel and metal processing",
        "Textile and dyeing units",
      ],
    },
    {
      num: "03",
      title: "Features",
      bullets: [
        "High oil removal efficiency",
        "Low maintenance requirements",
        "Robust construction for industrial duty",
        "Compact and skid-mounted options available",
        "Corrosion-resistant materials (SS/MS)",
        "Easy installation and operation",
      ],
    },
    {
      num: "04",
      title: "Specifications",
      bullets: [
        "Flow rate tailored to project requirements",
        "Material of construction: SS / MS with coating",
        "Design per site effluent characteristics",
        "Inlet oil concentration and outlet limits as per norms",
        "Optional automation and level controls",
      ],
    },
  ],
  faqs: [
    {
      question: "What is an oil water separator and what is it used for?",
      answer:
        "An oil water separator (OWS) removes oil and grease from industrial wastewater before discharge or further treatment. It is used in garages, refineries, food processing, and manufacturing plants to meet pollution control requirements.",
    },
    {
      question: "How does an oil water separator work?",
      answer:
        "Wastewater enters the separator where oil floats to the surface due to lower density than water. Coalescing plates or media enhance droplet merging for faster separation. Clean water is discharged from the bottom while oil is skimmed from the top.",
    },
    {
      question: "What are the common types of oil water separators?",
      answer:
        "Common types include gravity separators, API separators, coalescing plate separators (CPS), and vertical tube coalescers. Selection depends on oil droplet size, flow rate, and space constraints.",
    },
    {
      question: "What are the advantages of using an oil water separator?",
      answer:
        "Advantages include regulatory compliance, protection of downstream ETP equipment, reduced treatment costs, possible oil recovery, and prevention of environmental contamination.",
    },
    {
      question: "How is an oil water separator maintained?",
      answer:
        "Maintenance includes periodic removal of accumulated oil and sludge, inspection of coalescing media, checking inlet screens, calibration of level sensors, and structural inspection of tanks and piping.",
    },
    {
      question: "How does the oil water separator affect the environment?",
      answer:
        "By removing oil before discharge, OWS systems reduce water pollution, protect aquatic ecosystems, and help industries meet CPCB and state pollution board effluent standards.",
    },
    {
      question: "What are the regulations for oil water separator?",
      answer:
        "Regulations vary by state and industry but generally limit oil and grease in effluent to specified mg/L values. Industries must install adequate pre-treatment including OWS where oily wastewater is generated.",
    },
    {
      question: "What are the typical by-products of oil water separator?",
      answer:
        "By-products include recovered oil (which may be recycled or sent for authorized disposal), settled sludge, and treated water for discharge or further biological/chemical treatment.",
    },
  ],
} as const;
