import { siteImages } from "@/lib/site-images";

export const CONDENSATE_POLISHING_UNIT = {
  title: "Condensate Polishing Unit",
  intro:
    "KHM Infra Innovations is a leading manufacturer of condensate polishing units in India. We offer a wide range of condensate polishing units that are designed to meet the specific requirements of our clients. Our condensate polishing units are used in a variety of industries, including power plants, refineries, and chemical plants.",
  heroImages: {
    main: siteImages.engineers,
    secondary: [siteImages.etp, siteImages.govt],
  },
  treatmentSteps: [
    {
      num: "01",
      title: "Physical Treatment",
      body: "Physical treatment is the first step in the condensate polishing process. This step involves the removal of suspended solids from the condensate. This is typically done using a variety of methods, including filtration, sedimentation, and centrifugation. The choice of method will depend on the type and amount of suspended solids present in the condensate. Physical treatment is important because it helps to protect the downstream equipment from damage and ensures that the condensate is clean enough for further treatment.",
    },
    {
      num: "02",
      title: "Biological Treatment",
      body: "Biological treatment is the second step in the condensate polishing process. This step involves the removal of dissolved organic matter from the condensate. This is typically done using a variety of methods, including activated sludge, trickling filters, and rotating biological contactors. The choice of method will depend on the type and amount of dissolved organic matter present in the condensate. Biological treatment is important because it helps to reduce the biochemical oxygen demand (BOD) of the condensate and ensures that it is safe for discharge into the environment.",
    },
    {
      num: "03",
      title: "Chemical Treatment",
      body: "Chemical treatment is the third and final step in the condensate polishing process. This step involves the removal of dissolved inorganic matter from the condensate. This is typically done using a variety of methods, including ion exchange, reverse osmosis, and distillation. The choice of method will depend on the type and amount of dissolved inorganic matter present in the condensate. Chemical treatment is important because it helps to ensure that the condensate is of high quality and meets the requirements of the downstream equipment.",
    },
  ],
  banner: {
    text: "Some systems will be used for this purpose, whilst others are more complex.",
    image: siteImages.heroPlant,
  },
  detailBlocks: [
    {
      num: "01",
      title: "Pre-treatment",
      body: "The first step in any condensate polishing process is pre-treatment. This step involves the removal of suspended solids and other contaminants from the condensate. This is typically done using a variety of methods, including filtration, sedimentation, and centrifugation. The choice of method will depend on the type and amount of contaminants present in the condensate. Pre-treatment is important because it helps to protect the downstream equipment from damage and ensures that the condensate is clean enough for further treatment.",
    },
    {
      num: "02",
      title: "Polishing",
      body: "The second step in the condensate polishing process is polishing. This step involves the removal of dissolved contaminants from the condensate. This is typically done using a variety of methods, including ion exchange, reverse osmosis, and distillation. The choice of method will depend on the type and amount of contaminants present in the condensate. Polishing is important because it helps to ensure that the condensate is of high quality and meets the requirements of the downstream equipment. In some cases, polishing may also involve the removal of dissolved gases, such as oxygen and carbon dioxide. This is typically done using a variety of methods, including deaeration and chemical treatment. The choice of method will depend on the type and amount of dissolved gases present in the condensate.",
    },
    {
      num: "03",
      title: "Benefits",
      bullets: [
        "Improved boiler efficiency",
        "Reduced boiler maintenance costs",
        "Extended boiler life",
        "Improved steam quality",
        "Reduced emissions",
        "Compliance with environmental regulations",
      ],
    },
    {
      num: "04",
      title: "Applications",
      bullets: [
        "Power plants",
        "Refineries",
        "Chemical plants",
        "Pulp and paper mills",
        "Food and beverage processing plants",
        "Pharmaceutical plants",
        "Textile mills",
      ],
    },
  ],
  unitsOffered: [
    { image: siteImages.govt, alt: "Condensate polishing unit — treatment basins" },
    { image: siteImages.etp, alt: "Industrial condensate polishing facility" },
    { image: siteImages.waterRecycle, alt: "Outdoor CPU installation" },
    { image: siteImages.rainwater, alt: "Water treatment plant equipment" },
  ],
  faqs: [
    {
      question: "What is a Condensate Polishing Unit and what is it used for?",
      answer:
        "A condensate polishing unit (CPU) is a system used in power plants and other industrial facilities to remove impurities from the steam condensate that is returned to the boiler. This process helps to improve the efficiency of the boiler and extend its lifespan.",
    },
    {
      question: "What types of impurities does a CPU remove?",
      answer:
        "A CPU removes a variety of impurities from the steam condensate, including dissolved solids, suspended solids, and dissolved gases.",
    },
    {
      question: "What are the different types of CPUs available?",
      answer:
        "There are several different types of CPUs available, including ion exchange, reverse osmosis, and distillation. The type of CPU that is best for a particular application will depend on the specific requirements of the facility.",
    },
    {
      question: "Why is a CPU important?",
      answer:
        "A CPU is important because it helps to improve the efficiency of the boiler, extend its lifespan, and reduce maintenance costs. It also helps to improve the quality of the steam produced by the boiler.",
    },
    {
      question: "How does a CPU affect the overall efficiency of a thermal power plant or industrial facility?",
      answer:
        "A CPU affects the overall efficiency of a thermal power plant or industrial facility by improving the efficiency of the boiler. This is because a CPU removes impurities from the steam condensate that can cause fouling and corrosion in the boiler. By removing these impurities, a CPU helps to keep the boiler clean and operating at peak efficiency.",
    },
  ],
} as const;
