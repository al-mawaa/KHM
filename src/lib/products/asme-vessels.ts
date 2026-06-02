import { siteImages } from "@/lib/site-images";

export const ASME_VESSELS = {
  title: "ASME Vessels",
  intro:
    "As a leading manufacturer, we offer the highest quality ASME vessels for various industries. With expert designs and the best materials, our vessels are built to last and withstand the toughest conditions. Trust us for your vessel needs and experience excellence.",
  heroImages: {
    main: siteImages.heroPlant,
    secondary: [siteImages.waterTreatmentB, siteImages.engineers],
  },
  valueProposition:
    "We have an in-house unit, that helps us in providing revamping and manufacturing of all your equipment. Our team of engineers and mechanical experts provide round-the-clock service for all your needs and requirements.",
  valueImages: [siteImages.waterTreatmentB, siteImages.rainwater],
  detailBlocks: [
    {
      num: "01",
      title: "Finest Recognition",
      body: "Our dedication to high-quality products and adherence to international standards has earned us recognition among clients in power, oil and gas, chemical, and water treatment sectors. We build long-term trust through reliable delivery and certified fabrication.",
    },
    {
      num: "02",
      title: "Functionality",
      body: "Our team of skilled engineers uses the latest technology and design software to ensure every ASME vessel meets safety standards and performs reliably under design pressure and temperature. Functionality and structural integrity are verified through documented QA procedures.",
    },
    {
      num: "03",
      title: "Packing",
      body: "We offer customized packing solutions using high-quality materials to ensure secure transport and on-time delivery. Vessels are protected against corrosion and damage during handling and shipment to site.",
    },
    {
      num: "04",
      title: "Measuring",
      body: "We use the latest technology and precision measuring equipment throughout fabrication to ensure dimensional accuracy, weld quality, and compliance with ASME code requirements before dispatch and installation.",
    },
  ],
  faqs: [
    {
      question: "What is an ASME vessel and what is its purpose?",
      answer:
        "An ASME vessel is a pressure vessel designed and fabricated in accordance with American Society of Mechanical Engineers (ASME) guidelines. It is used to store or transport fluids under pressure in industries such as oil and gas, power, chemical, and water treatment.",
    },
    {
      question: "What are the key components of an ASME vessel?",
      answer:
        "Key components include the shell, heads (ellipsoidal, torispherical, or flat), nozzles, supports, flanges, and internal accessories as required by the process design.",
    },
    {
      question: "What are the design and construction guidelines for ASME vessels?",
      answer:
        "Design and construction follow the ASME Boiler and Pressure Vessel Code (BPVC), covering material selection, design calculations, welding procedures, non-destructive testing, and documentation.",
    },
    {
      question: "What are the benefits of using an ASME vessel?",
      answer:
        "Benefits include high safety standards, proven quality, durability under pressure, regulatory acceptance, and customizability for specific process requirements.",
    },
    {
      question: "What are the safety considerations when working with ASME vessels?",
      answer:
        "Safety requires regular maintenance, proper installation, pressure relief protection, trained operators, and adherence to operating limits and inspection schedules defined in the code and project specifications.",
    },
    {
      question: "What are the regulations and standards for ASME vessels?",
      answer:
        "ASME vessels must comply with the ASME BPVC and applicable national regulations. It is important to work with reputable manufacturers who provide certified fabrication and documentation.",
    },
    {
      question: "How can I improve the efficiency of my ASME vessel?",
      answer:
        "Efficiency can be improved through regular maintenance, upgrading components where needed, optimizing design with a qualified engineer, and ensuring correct operating conditions within design limits.",
    },
    {
      question: "What is the difference between an ASME vessel and a non-ASME vessel?",
      answer:
        "ASME vessels are designed, fabricated, and tested to meet specific ASME safety and quality standards. Non-ASME vessels may not meet the same rigorous requirements and may not be accepted for regulated or high-risk applications.",
    },
  ],
} as const;
