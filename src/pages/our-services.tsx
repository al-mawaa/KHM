import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Map, Wrench } from "lucide-react";
import { PageHero } from "@/components/PageHero";

const services = [
  {
    title: "WATER SUPPLY & DRINKING WATER",
    items: [
      "Feasibility Studies & Master Planning",
      "Hydraulic Network Modelling (WaterGEMS / EPANET)",
      "Detailed Project Reports (DPRs)",
      "Water Treatment Plant (WTP) Design",
      "Pumping Station & Distribution Network Design",
      "24×7 Water Supply System Design",
      "Jal Jeevan Mission & AMRUT 2.0 Projects",
    ],
  },
  {
    title: "SEWERAGE & WASTEWATER MANAGEMENT",
    items: [
      "Sewerage Network Planning & Design",
      "Sewage Treatment Plant (STP) Design",
      "Effluent Treatment Plant (ETP) Design",
      "Used Water Management under SBM 2.0",
      "Sewer Network Modelling (SewerGEMS)",
      "Industrial Wastewater Solutions",
      "River Pollution Abatement Studies",
    ],
  },
  {
    title: "CIVIL INFRASTRUCTURE",
    items: [
      "Roads, Bridges & Flyover DPR Design",
      "Structural Design & Detailing",
      "Solid Waste Management Systems",
      "Park, Lake & Riverfront Development",
      "Drainage & Stormwater Management",
      "Urban Development & Smart City Projects",
      "Industrial Infrastructure Planning",
    ],
  },
  {
    title: "IRRIGATION ENGINEERING",
    items: [
      "Irrigation Canal & Distribution Network Design",
      "Command Area Survey & Planning",
      "Lift Irrigation Schemes",
      "Dam Survey & DPR Preparation",
      "Pipeline Distribution Network (PDN)",
      "Underground Pipeline Systems (UGPL)",
      "Water Resource Master Plans",
    ],
  },
  {
    title: "REAL ESTATE DEVELOPMENT",
    items: [
      "Residential Township Planning & Design",
      "Commercial Complex Development",
      "Integrated Township Infrastructure Services",
      "Water & Sanitation Services for Housing",
      "Site Development & Layout Planning",
      "Building Services & MEP Design",
      "RERA Compliance & Documentation",
    ],
  },
  {
    title: "POWER SECTOR",
    items: [
      "Solar & Renewable Energy Project DPRs",
      "Power Distribution Network Design",
      "Electrical Infrastructure for Industrial Areas",
      "Captive Power Plant Planning",
      "Energy Audit & Conservation Studies",
      "Street Lighting & Smart Grid Design",
      "Industrial Power Infrastructure",
    ],
  },
  {
    title: "PROJECT MANAGEMENT (PMC)",
    items: [
      "PMC — Concept to Commissioning",
      "Tender Documentation & Bid Management",
      "Construction Supervision & Monitoring",
      "Contract Administration",
      "Third-Party Inspection (TPIA)",
      "Quality Control & Energy Audits",
      "Statutory Compliance Management",
    ],
  },
  {
    title: "O&M & AMC SERVICES",
    items: [
      "Water Supply System O&M",
      "Sewerage & STP Operation",
      "Infrastructure Asset Management",
      "Preventive & Corrective Maintenance",
      "Performance Monitoring & Benchmarking",
      "Staff Training & Capacity Building",
      "Smart Monitoring System Integration",
    ],
  },
];

const expertise = [
  {
    title: "Survey & Investigation",
    items: [
      "Drone Topographic Surveys (UAV)",
      "DGPS & Total Station Surveys",
      "GIS & DEM Mapping",
      "Geotechnical Investigations",
      "Bathymetric / Underwater Surveys",
      "Topographic Data Processing",
    ],
  },
  {
    title: "Planning & Feasibility",
    items: [
      "Infrastructure Master Planning",
      "Water Demand Forecasting",
      "Financial Feasibility Reports",
      "City Sanitation Plans",
      "Eco-Village Development Plans",
      "Environmental Impact Assessment",
    ],
  },
  {
    title: "Design Engineering & DPR",
    items: [
      "Hydraulic Network Modelling",
      "Water & Sewer System Design",
      "STP & Pumping Station Design",
      "Road & Bridge Structural Design",
      "Irrigation Canal & PDN Design",
      "DPR & Detailed Engineering Documents",
    ],
  },
  {
    title: "Project Management",
    items: [
      "PMC — Concept to Commissioning",
      "Tender Documentation & Bidding",
      "Construction Supervision",
      "Contract Administration",
      "Monitoring & Evaluation",
      "Dispute Resolution Support",
    ],
  },
  {
    title: "Audits & Inspections",
    items: [
      "Third-Party Inspection (TPIA)",
      "Water & Energy Audits",
      "Quality Control (SQC)",
      "Environmental Compliance Audits",
      "Safety & Structural Audits",
      "Asset Condition Assessment",
    ],
  },
  {
    title: "O&M & Asset Management",
    items: [
      "Infrastructure Asset Mapping",
      "Preventive Maintenance Planning",
      "Performance Benchmarking",
      "Staff Training & Capacity Building",
      "Smart SCADA / Monitoring Systems",
      "O&M Manuals & SOP Development",
    ],
  },
];

const technologies = [
  {
    title: "Hydraulic Modelling Software",
    items: [
      "WaterGEMS / WaterCAD (Bentley OpenFlows)",
      "SewerGEMS / OpenFlows Sewer Standard",
      "EPANET Water Distribution Modelling",
      "KY Pipe / Water Work Suite",
    ],
  },
  {
    title: "Survey & Mapping Tools",
    items: [
      "Drone UAV (Kingfisher 30) — Aerial & Topographic",
      "Leica / Nikon DGPS & GPS Units",
      "Total Station — Angular & Distance Measurement",
      "Echo Sounder — Bathymetric Surveys",
    ],
  },
  {
    title: "Design & Drafting Software",
    items: [
      "ZWCAD 2025 Standard & Standalone",
      "E Survey Titanium",
      "Global Mapper 20.1",
      "AutoCAD Civil & Structural Design",
    ],
  },
  {
    title: "GIS & Remote Sensing",
    items: [
      "GIS Mapping & Spatial Analysis",
      "DEM & Contour Generation",
      "Satellite Imagery Processing",
      "Drone Data Processing (Point Clouds)",
    ],
  },
];

export default function OurServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="What We Deliver"
        description="Engineering sustainable infrastructure solutions across water, wastewater, civil, power, irrigation, real estate, and project management sectors."
      />

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276] bg-[#1a5276]/5 rounded-full mb-4">
              Core Services
            </span>
            <h2 className="text-[42px] font-bold text-[#1a5276] leading-tight">
              Comprehensive Infrastructure Solutions
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From concept to commissioning, we deliver end-to-end engineering excellence across multiple sectors.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a5276] to-[#25a244] rounded-l-xl" />
                <h3 className="text-[24px] font-bold text-[#1a5276] mb-6 pr-4 leading-tight">
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#25a244] mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276] bg-[#1a5276]/5 rounded-full mb-4">
              OUR EXPERTISE
            </span>
            <h2 className="text-[42px] font-bold text-[#1a5276] leading-tight">
              Technical Capabilities
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Advanced technical expertise backed by cutting-edge tools and methodologies.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a5276] to-[#25a244] text-white">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <h3 className="text-[24px] font-bold text-[#1a5276] leading-tight">
                    {item.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {item.items.map((subItem) => (
                    <li
                      key={subItem}
                      className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#25a244] mt-0.5" />
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276] bg-[#1a5276]/5 rounded-full mb-4">
              TECHNOLOGY & TOOLS
            </span>
            <h2 className="text-[42px] font-bold text-[#1a5276] leading-tight">
              Advanced Technology Stack
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Industry-leading software and tools for precision engineering and analysis.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a5276] to-[#25a244] text-white">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h3 className="text-[24px] font-bold text-[#1a5276] leading-tight">
                    {tech.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {tech.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#25a244] mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
