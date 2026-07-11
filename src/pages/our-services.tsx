import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Map, Wrench, Loader2, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/services/ServiceCard";
import { IService } from "@/lib/models/Service";
import { useState, useEffect } from "react";

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
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categoryNames = Array.from(
    new Set(services.map((s) => s.category).filter((cat): cat is string => Boolean(cat)))
  ).sort();
  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive water, wastewater and infrastructure solutions engineered for sustainable growth and operational excellence."
      />

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {/* <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276] bg-[#1a5276]/5 rounded-full mb-4">
              Core Services
            </span> */}
            <h2 className="text-[42px] font-bold text-[#1a5276] leading-tight">
              Comprehensive Infrastructure Solutions
            </h2>
            <p className="mt-4 text-lg text-black max-w-3xl mx-auto leading-relaxed">
              From concept to commissioning, we deliver end-to-end engineering excellence across multiple sectors.
            </p>
          </motion.div>

          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === "All"
                    ? "bg-[#1a5276] text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-[#1a5276] text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 lg:ml-auto lg:shrink-0">
              <label htmlFor="service-category-filter" className="text-sm font-semibold text-black whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative w-full sm:w-56">
                <select
                  id="service-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-black shadow-sm transition-colors focus:border-[#1a5276] focus:outline-none focus:ring-2 focus:ring-[#1a5276]/20"
                >
                  <option value="All">All Categories</option>
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-black">
              No services found in this category.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service._id?.toString()} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
End-to-End Solutions
            </h2>
            <p className="mt-4 text-lg text-black max-w-3xl mx-auto leading-relaxed">
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
                      className="flex items-start gap-3 text-[15px] leading-7 text-black"
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
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
            <p className="mt-4 text-lg text-black max-w-3xl mx-auto leading-relaxed">
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
                      className="flex items-start gap-3 text-[15px] leading-7 text-black"
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
