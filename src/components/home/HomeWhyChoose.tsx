import { motion } from "framer-motion";
import { CheckCircle2, Shield, Zap, Target, Users, Wrench, DollarSign, Award, Clock } from "lucide-react";

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
  {
    title: "Cost-Effective Solutions",
    content: [
      "Optimized design and resource planning",
      "Value engineering for long-term savings",
      "Transparent pricing with no hidden costs",
    ],
    icon: DollarSign,
  },
  {
    title: "Quality You Can Trust",
    content: [
      "Strict quality control at every stage",
      "Use of best-in-class materials & technology",
      "Built to last, built to perform",
    ],
    icon: Award,
  },
  {
    title: "Timely Project Delivery",
    content: [
      "Strong planning and scheduling",
      "Real-time monitoring & proactive problem-solving",
      "On-time completion, every time",
    ],
    icon: Clock,
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
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-black">
            Our Differentiators
          </p>
          <div className="mt-3 sm:mt-4 mx-auto h-1 w-20 sm:w-24 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full" />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            const isOdd = (index + 1) % 2 === 1;
            const accentColor = isOdd ? "#2BA84A" : "#0B5FA5";
            const cardNumber = (index + 1).toString().padStart(2, "0");

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cut-out section with circular icon */}
                <div
                  className={`absolute top-0 ${isOdd ? 'left-0' : 'right-0'} w-20 h-20 rounded-br-xl ${isOdd ? 'rounded-tr-xl' : 'rounded-tl-xl'} flex items-center justify-center`}
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center">
                    <Icon className="h-7 w-7" style={{ color: accentColor }} />
                  </div>
                </div>

                {/* Number and Title */}
                <div className={`${isOdd ? 'pl-24' : 'pr-24 text-right'} mb-4`}>
                  <div
                    className="text-4xl font-bold leading-none mb-1"
                    style={{ color: accentColor }}
                  >
                    {cardNumber}
                  </div>
                  <h3
                    className="text-lg font-semibold leading-tight"
                    style={{ color: accentColor }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-2">
                  {item.content.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 text-sm leading-6 text-black"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
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
              <p className="relative text-[17px] leading-8 text-black italic font-medium pl-8">
                KHM Infra Innovations embraces quality, innovation, and sustainability — from the initial consultation through project commissioning and beyond. Our commitment to our clients is not just a project promise; it is a lasting partnership.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
