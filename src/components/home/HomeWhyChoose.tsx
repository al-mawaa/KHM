import { motion } from "framer-motion";
import { CheckCircle2, Shield, Zap, Target, Users, Wrench } from "lucide-react";

const differentiators = [
  {
    title: "End-to-End Project Lifecycle",
    content: [
      "Feasibility through O&M — all under one roof",
      "DPR, tendering, PMC, and commissioning",
      "No handoffs, consistent quality throughout",
    ],
    icon: Target,
  },
  {
    title: "Multi-Sector Expertise",
    content: [
      "Water, sewerage, civil, power, real estate",
      "Irrigation, riverfront, industrial infra",
      "Cross-sector teams for integrated solutions",
    ],
    icon: Wrench,
  },
  {
    title: "Government Mission Aligned",
    content: [
      "Jal Jeevan Mission, AMRUT 2.0, SBM 2.0",
      "Expertise in DPR for government schemes",
      "Empanelment-ready for state & central agencies",
    ],
    icon: Shield,
  },
  {
    title: "Technology-Driven Delivery",
    content: [
      "WaterGEMS / SewerGEMS modelling",
      "Drone UAV surveys & GIS mapping",
      "SCADA & smart monitoring integration",
    ],
    icon: Zap,
  },
  {
    title: "Agile New-Generation Firm",
    content: [
      "Responsive, flexible project teams",
      "Fresh thinking with experienced leadership",
      "Quick turnaround on complex assignments",
    ],
    icon: Users,
  },
  {
    title: "Integrity & Transparency",
    content: [
      "Ethical, accountable engagement",
      "Clear communication at every stage",
      "Client-first approach in every project",
    ],
    icon: CheckCircle2,
  },
];

export function HomeWhyChoose() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a5276]">
            WHY CHOOSE KHM INFRA?
          </h2>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-500">
            Our Differentiators
          </p>
          <div className="mt-3 sm:mt-4 mx-auto h-1 w-20 sm:w-24 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full" />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a5276] to-[#25a244] rounded-l-xl" />
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a5276]/10 to-[#25a244]/10 text-[#1a5276] group-hover:bg-gradient-to-br group-hover:from-[#1a5276] group-hover:to-[#25a244] group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#1a5276] leading-tight">
                    {item.title}
                  </h3>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {item.content.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 sm:gap-3 text-sm sm:text-[15px] leading-6 sm:leading-7 text-gray-700"
                    >
                      <div className="mt-1.5 sm:mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#25a244]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <div className="relative rounded-2xl border border-[#1a5276]/20 bg-gradient-to-br from-[#1a5276]/5 via-white to-[#25a244]/5 p-8 lg:p-12 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a5276] via-[#25a244] to-[#1a5276] rounded-t-2xl" />
            <div className="relative">
              <div className="absolute -top-6 -left-2 text-[#1a5276]/20">
                <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="relative text-[17px] leading-8 text-gray-800 italic font-medium pl-8">
                KHM Infra Innovations embraces quality, innovation, and sustainability — from the initial consultation through project commissioning and beyond. Our commitment to our clients is not just a project promise; it is a lasting partnership.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
