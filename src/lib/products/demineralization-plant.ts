import { siteImages } from "@/lib/site-images";

export const DEMINERALIZATION_PLANT = {
  title: "Demineralization Plant",
  intro:
    "A demineralization plant is a system that removes minerals and salts from water. It is a process that uses ion exchange resins to remove dissolved solids from water. The process involves passing water through a series of ion exchange resins that remove positively and negatively charged ions from the water.",
  heroImages: {
    main: siteImages.waterTreatmentC,
    secondary: [siteImages.waterRecycle, siteImages.rainwater],
  },
  valueProposition:
    "The Water Demineralization Plant are of the highly compact, efficient and modular design. It provides more benefits in terms of cost and space saving, and can effectively handle with the most demanding water quality.",
  valueImages: [siteImages.iot, siteImages.etp],
  detailBlocks: [
    {
      num: "01",
      title: "Process Description",
      body: "The DM plant process consists of two stages, namely cation exchange and anion exchange. In the cation exchange stage, water is passed through a bed of cation exchange resin that removes positively charged ions such as calcium, magnesium, and sodium. In the anion exchange stage, water is passed through a bed of anion exchange resin that removes negatively charged ions such as chloride, sulfate, and bicarbonate. The resulting water is demineralized and has a low conductivity.",
    },
    {
      num: "02",
      title: "Performance",
      body: "The performance of a demineralization plant depends on several factors, such as the quality of the feed water, the type of resin used, and the design of the plant. The efficiency of the plant is measured by the conductivity of the treated water. The lower the conductivity, the higher the purity of the water. The plant's performance can be optimized by monitoring the feed water quality and adjusting the regeneration cycle of the resins.",
    },
    {
      num: "03",
      title: "Features",
      bullets: [
        "User-friendly",
        "Easy to install",
        "Low power consumption",
        "Compact design",
        "Corrosion-resistant construction",
        "High-quality components and materials",
      ],
    },
    {
      num: "04",
      title: "Benefits",
      bullets: [
        "High-purity water for various industrial and commercial applications",
        "Cost-effective compared to other water treatment methods",
        "Reduces the risk of equipment damage and scaling in industrial processes",
        "Environmentally friendly as it does not use chemicals for water treatment",
      ],
    },
  ],
  plantsOffered: [
    { image: siteImages.waterTreatmentC, alt: "Demineralization plant with blue tanks" },
    { image: siteImages.waterRecycle, alt: "DM plant piping installation" },
    { image: siteImages.heroPlant, alt: "Industrial demineralization system" },
    { image: siteImages.rainwater, alt: "Green and silver DM plant vessels" },
  ],
  faqs: [
    {
      question: "What is a demineralization plant?",
      answer:
        "A demineralization plant is a water treatment system that removes dissolved minerals and salts from water using ion exchange resins, producing high-purity demineralized water with very low conductivity.",
    },
    {
      question: "How does a demineralization plant work?",
      answer:
        "Water passes through cation exchange resin to remove positive ions, then through anion exchange resin to remove negative ions. Regeneration with acid and caustic restores resin capacity when saturated.",
    },
    {
      question: "What are the advantages of demineralization plant?",
      answer:
        "DM plants provide high-purity water, are cost-effective for many applications, protect boilers and process equipment from scaling, and deliver consistent water quality for critical industrial processes.",
    },
    {
      question: "What are the disadvantages of demineralization plant?",
      answer:
        "Demineralization requires regular resin regeneration, chemical handling for regeneration, periodic resin replacement, and proper monitoring to maintain outlet water quality.",
    },
    {
      question: "What are the common applications of demineralized water?",
      answer:
        "Common applications include power generation, pharmaceuticals, electronics manufacturing, food and beverage production, agriculture, laboratories, hospitals, and textile processing.",
    },
    {
      question: "How often does the ion exchange resin need to be replaced?",
      answer:
        "Resin replacement depends on feed water quality, treated volume, and regeneration practices. Resin is typically replaced when it no longer achieves required conductivity after regeneration — often after several years of service.",
    },
    {
      question: "Can demineralization plant process water with a high TDS level?",
      answer:
        "Yes, DM plants can treat high TDS water, though efficiency may decrease and regeneration frequency may increase. Pre-treatment such as softening or RO may be recommended for very high TDS sources.",
    },
  ],
} as const;
