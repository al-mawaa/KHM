import { siteImages } from "@/lib/site-images";

export const ELECTRICAL_CONTROL_PANELS = {
  title: "Electrical Control Panels",
  intro:
    "As a leading manufacturer, supplier, and exporter of electrical control panels, KHM Infra Innovations offers high-quality and reliable solutions for various industries. Our panels are designed to meet international standards and can be customized to meet your specific requirements.",
  heroImages: {
    main: siteImages.iot,
    secondary: [siteImages.engineers, siteImages.smartCity],
  },
  valueProposition:
    "KHM Infra Innovations is a market leader in manufacturing and installation of various electrical panels for water treatment, wastewater, and industrial automation applications.",
  valueImage: siteImages.engineers,
  detailBlocks: [
    {
      num: "01",
      title: "PLC Control Panels",
      body: "Our PLC (Programmable Logic Controller) panels are designed to provide reliable and efficient control of industrial processes. We use high-quality components and the latest technology to ensure that our panels meet the highest standards of quality and performance. Our team of experts can design and manufacture custom PLC panels to meet your specific needs.",
    },
    {
      num: "02",
      title: "MCC Panels",
      body: "We manufacture MCC (Motor Control Center) panels that are designed to provide centralized control and protection of electric motors. Our MCC panels are built to withstand harsh industrial environments and are designed for easy installation and maintenance. We offer a wide range of MCC panels to meet different motor control requirements.",
    },
    {
      num: "03",
      title: "VFD Panels",
      body: "Our VFD (Variable Frequency Drive) panels are designed to provide precise control of motor speed and torque, resulting in energy savings and improved process control. We use high-quality VFDs from leading manufacturers to ensure the reliability and performance of our panels. Our VFD panels can be customized to meet your specific application requirements.",
    },
    {
      num: "04",
      title: "APFC Panels",
      body: "We offer APFC (Automatic Power Factor Correction) panels that are designed to improve the power factor of your electrical system, resulting in reduced energy costs and improved efficiency. Our APFC panels are equipped with high-quality capacitors and controllers to ensure accurate and reliable power factor correction. We can design and manufacture custom APFC panels to meet your specific requirements.",
    },
  ],
  faqs: [
    {
      question: "What is an electric control panel and what is its purpose?",
      answer:
        "An electric control panel is the central enclosure that houses electrical components used to monitor and control mechanical and process equipment. It acts as the brain of a system, receiving signals from sensors and operators and sending commands to motors, valves, pumps, and other devices to automate safe and efficient operation.",
    },
    {
      question: "What types of systems are controlled by electric control panels?",
      answer:
        "Control panels are used in HVAC systems, industrial machinery, water and wastewater treatment plants, pumping stations, conveyors, packaging lines, and building management systems. In our domain, they automate clarifiers, filters, RO plants, chemical dosing, and plant-wide interlocks.",
    },
    {
      question: "How does an electric control panel work?",
      answer:
        "Input devices such as sensors, switches, and HMI screens send signals to a controller (typically a PLC). The controller processes logic and sends output commands to contactors, VFDs, valves, and alarms. Power distribution, protection devices, and wiring terminals are organized within the panel for safe operation and maintenance access.",
    },
    {
      question: "What are the benefits of using an electric control panel?",
      answer:
        "Benefits include improved process efficiency, centralized control, enhanced safety through interlocks and alarms, reduced manual operation, lower downtime, easier troubleshooting, and compliance with electrical and process standards when properly designed and documented.",
    },
    {
      question: "How often should an electric control panel be inspected and maintained?",
      answer:
        "Panels should be inspected regularly per manufacturer recommendations and site safety policy—typically quarterly visual checks and annual detailed inspection including torque checks on terminals, cleaning, ventilation verification, and testing of protection devices. Critical plants may require more frequent preventive maintenance.",
    },
    {
      question: "What are the safety considerations when working with electric control panels?",
      answer:
        "Only qualified personnel should work inside energized panels. Use appropriate PPE, follow lockout/tagout procedures before maintenance, verify de-energization, respect arc-flash boundaries, maintain clear labeling, and ensure panels remain properly grounded and ventilated.",
    },
    {
      question: "What are the regulations and standards for electric control panels?",
      answer:
        "Panels must comply with applicable electrical codes and standards such as IEC 61439, IS standards, and local electrical regulations. Design includes proper short-circuit rating, IP enclosure class, wire sizing, earthing, and documentation for inspection and commissioning.",
    },
    {
      question: "How can I improve the efficiency of my electric control panel?",
      answer:
        "Efficiency can be improved by using VFDs for variable loads, high-efficiency motors, optimized PLC control logic, power factor correction (APFC), regular maintenance, and upgrading obsolete components. Energy monitoring and load profiling help identify further savings opportunities.",
    },
  ],
} as const;
