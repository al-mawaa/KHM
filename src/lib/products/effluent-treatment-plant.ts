import { siteImages } from "@/lib/site-images";

export const EFFLUENT_TREATMENT_PLANT = {
  title: "Effluent Treatment Plant",
  intro:
    "An effluent treatment plant (ETP) is a process designed to treat industrial and commercial wastewater so that it can be reused or safely released into the environment. KHM Infra Innovations delivers complete ETP solutions engineered for regulatory compliance, water recovery, and sustainable industrial operations.",
  heroImages: {
    main: siteImages.etp,
    secondary: [siteImages.engineers, siteImages.waterRecycle],
  },
  valueProposition:
    "The Effluent Treatment plant is also known as ETP. It's a process of wastewater treatment that is used to treat industrial and commercial wastewater so that it can be reused or safely released into the environment.",
  valueImages: [siteImages.heroPlant, siteImages.iot],
  detailBlocks: [
    {
      num: "01",
      title: "Pre-treatment",
      body: "Pre-treatment is the initial stage where large solids, grit, oil, and grease are removed from industrial effluent through screening, oil and grease traps, and equalization. This protects downstream equipment and stabilizes flow and load for consistent plant performance.",
    },
    {
      num: "02",
      title: "Primary Treatment",
      body: "Primary treatment uses physical and chemical processes such as coagulation, flocculation, and sedimentation to remove suspended solids and settleable matter. Clarifiers and tube settlers separate sludge from partially treated effluent before biological treatment.",
    },
    {
      num: "03",
      title: "Secondary Treatment",
      body: "Secondary treatment employs biological processes where microorganisms degrade organic pollutants. Technologies such as activated sludge, MBBR, SBR, and aerobic or anaerobic digestion reduce BOD, COD, and organic load to meet discharge standards.",
    },
    {
      num: "04",
      title: "Tertiary Treatment",
      body: "Tertiary treatment provides advanced polishing through filtration, activated carbon, membrane processes, and disinfection. This stage further improves effluent quality for reuse, irrigation, or safe environmental discharge.",
    },
  ],
  plantsOffered: [
    { image: siteImages.etp, alt: "Industrial effluent treatment plant" },
    { image: siteImages.waterTreatmentB, alt: "ETP with clarifier and piping" },
    { image: siteImages.govt, alt: "Large-scale ETP installation" },
    { image: siteImages.smartCity, alt: "Commercial effluent treatment system" },
  ],
  faqs: [
    {
      question: "What is an Effluent Treatment Plant (ETP)?",
      answer:
        "An effluent treatment plant is a facility that treats industrial wastewater to remove pollutants before reuse or discharge. ETPs are essential for industries to meet environmental regulations and protect water resources.",
    },
    {
      question: "How does an ETP work?",
      answer:
        "ETP works through multiple stages — pre-treatment, primary, secondary, and tertiary treatment — using physical, chemical, and biological processes to progressively remove contaminants from industrial effluent.",
    },
    {
      question: "What are the main stages of a typical ETP?",
      answer:
        "The main stages are pre-treatment (screening and equalization), primary treatment (sedimentation and coagulation), secondary treatment (biological degradation), and tertiary treatment (filtration and disinfection).",
    },
    {
      question: "What are the common technologies used in ETPs?",
      answer:
        "Common technologies include activated sludge process, MBBR, SBR, MBR, API separators, DAF units, clarifiers, filters, and advanced treatment such as RO or evaporators for ZLD applications.",
    },
    {
      question: "Why is it important for industries to have an ETP?",
      answer:
        "Industries must treat effluent to comply with pollution control board norms, avoid penalties, protect the environment, enable water reuse, and support corporate sustainability and CSR commitments.",
    },
    {
      question: "What are the benefits of using an Effluent Treatment Plant (ETP)?",
      answer:
        "Benefits include environmental protection, regulatory compliance, reduced freshwater consumption through reuse, lower disposal costs, improved public image, and protection of downstream ecosystems.",
    },
    {
      question: "How often does an ETP need maintenance?",
      answer:
        "ETP requires regular monitoring of inlet and outlet quality, pump and blower servicing, sludge removal, chemical dosing calibration, and periodic cleaning of clarifiers, reactors, and filters — typically on daily, weekly, and monthly schedules.",
    },
    {
      question: "What are the different types of ETPs available?",
      answer:
        "ETPs are available as batch systems, continuous flow plants, packaged modular units, and custom civil installations. Selection depends on effluent characteristics, capacity, land availability, and discharge requirements.",
    },
  ],
} as const;
