import { siteImages } from "@/lib/site-images";

export const WATER_SOFTENING_PLANT = {
  title: "Water Softening Plant",
  intro: [
    "KHM Infra Innovations Water Softening Plant is used for removing the hardness from the water. Hard water contains high amounts of calcium and magnesium ions. These ions can cause scaling in pipes and appliances, reduce the effectiveness of soaps and detergents, and leave spots on dishes and glassware.",
    "Our Water Softening Plant uses a process called ion exchange to remove these ions from the water. In this process, the hard water is passed through a tank containing resin beads that are coated with sodium ions. As the hard water passes through the resin beads, the calcium and magnesium ions are exchanged for sodium ions, resulting in soft water.",
  ],
  heroImages: {
    main: siteImages.rainwater,
    secondary: [siteImages.waterTreatmentC, siteImages.iot],
  },
  featureBanner: {
    label: "KHM Water Softening Plant",
    image: siteImages.waterTreatmentB,
  },
  detailBlocks: [
    {
      num: "01",
      title: "Resin Capacity",
      body: "The resin capacity of a water softener plant refers to the amount of hardness ions that the resin can remove before it needs to be regenerated. The resin capacity depends on the size of the tank and the amount of resin it contains. A larger tank with more resin will have a higher resin capacity and will need to be regenerated less frequently.",
    },
    {
      num: "02",
      title: "Regeneration",
      body: "Regeneration is the process of cleaning the resin beads and restoring their ability to remove hardness ions. This is done by flushing the resin beads with a brine solution (a mixture of salt and water). The sodium ions in the brine solution replace the calcium and magnesium ions on the resin beads, which are then flushed out of the system. The regeneration process can be manual or automatic, depending on the type of water softener plant.",
    },
    {
      num: "03",
      title: "Features",
      bullets: [
        "High-quality resin beads for efficient hardness removal.",
        "Automatic or manual regeneration options.",
        "Durable and corrosion-resistant tanks.",
        "Easy to install and maintain.",
        "Compact design for space-saving.",
        "Provides soft water for various applications.",
      ],
    },
    {
      num: "04",
      title: "Applications",
      bullets: [
        "Residential and commercial buildings.",
        "Industrial processes and manufacturing.",
        "Boiler feed water treatment.",
        "Cooling tower water treatment.",
        "Laundry and dishwashing.",
        "Hospitality and food service.",
      ],
    },
  ],
  plantsOffered: [
    { image: siteImages.rainwater, alt: "Blue vertical softener tanks installation" },
    { image: siteImages.waterRecycle, alt: "Industrial water softening system" },
    { image: siteImages.heroPlant, alt: "Softener plant with piping" },
    { image: siteImages.engineers, alt: "Indoor softening equipment setup" },
  ],
  faqs: [
    {
      question: "What is a water softener plant?",
      answer:
        "A water softener plant is a treatment system designed to remove hardness minerals such as calcium and magnesium from water through ion exchange. It produces soft water that reduces scaling, improves cleaning efficiency, and protects plumbing and process equipment.",
    },
    {
      question: "How does a water softener plant work?",
      answer:
        "Hard water flows through a resin bed where calcium and magnesium ions are exchanged with sodium ions on the resin beads. When the resin becomes saturated, regeneration with brine restores the resin and flushes accumulated hardness ions from the system.",
    },
    {
      question: "What are the advantages of using a water softener plant?",
      answer:
        "Benefits include prevention of scale formation in pipes and boilers, improved soap and detergent efficiency, reduced chemical usage, softer skin and hair, energy savings, and extended life of appliances and industrial equipment.",
    },
    {
      question: "What are the different types of water softener plant?",
      answer:
        "Water softener plants are available in manual, semi-automatic, and fully automatic configurations with varying capacities for residential, commercial, and industrial applications. Selection depends on flow rate, hardness level, and regeneration preference.",
    },
    {
      question: "What are the common applications of water softener plant?",
      answer:
        "Common applications include homes, hotels, industrial boilers, laundries, food production facilities, cooling towers, and any process requiring low-hardness water to protect equipment and improve product quality.",
    },
    {
      question: "How often is the resin in a water softener plant replaced?",
      answer:
        "Resin typically lasts 10–15 years depending on raw water quality, operating conditions, and proper regeneration. Regular maintenance and correct brine dosing help maximize resin life and treatment performance.",
    },
    {
      question: "Can a water softener plant be used for water with high TDS level?",
      answer:
        "Water softening removes hardness ions but does not significantly reduce overall total dissolved solids (TDS). For high TDS water, a reverse osmosis or demineralization system may be required in addition to softening.",
    },
    {
      question: "Are there any alternative methods to soften water?",
      answer:
        "Alternatives include template-assisted crystallization (TAC), electromagnetic water conditioners, and citric acid-based systems. Ion exchange remains the most widely used and proven method for reliable hardness removal.",
    },
  ],
} as const;
