import { motion } from "framer-motion";
import Image from "next/image";
import { Counter } from "@/components/Counter";
import { KEY_ASSETS } from "@/lib/home-content";
import { Award, Building2, Users, Globe, Droplet, HardHat } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

const iconMap = {
  award: Award,
  building: Building2,
  users: Users,
  globe: Globe,
  droplet: Droplet,
  "hard-hat": HardHat,
} as const;

const brandColors = {
  blue: "#0B5FA5",
  green: "#2BA84A",
  blueLight: "#0B5FA5",
  greenLight: "#2BA84A",
  blueDark: "#084a82",
  greenDark: "#228a3a",
};

function StatCard({ stat, index }: { stat: typeof KEY_ASSETS[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = iconMap[stat.icon as keyof typeof iconMap];
  const isBlue = index % 2 === 0;
  const accentColor = isBlue ? brandColors.blue : brandColors.green;
  const accentGradient = isBlue
    ? `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.blueLight} 100%)`
    : `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.greenLight} 100%)`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative rounded-[16px] bg-white p-4 md:p-5 shadow-[0_6px_20px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-[0.4s] ease-out hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:scale-[1.01] hover:border-[#0B5FA5]"
    >
      {/* Decorative Accent Shape - extends outside card for dynamic effect */}
      <div
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl opacity-15 group-hover:opacity-25 transition-all duration-[0.4s] group-hover:scale-105"
        style={{
          background: accentGradient,
          transform: "rotate(-12deg) translateY(-50%)",
        }}
      />

      {/* Icon Container */}
      <div className="relative mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-[0.4s] ease-out group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
        <Icon className="h-6 w-6" style={{ color: accentColor }} />
      </div>

      {/* Number */}
      <div
        className="text-[32px] sm:text-[36px] md:text-[40px] font-extrabold leading-none"
        style={{ color: accentColor }}
      >
        <Counter to={stat.value} suffix={stat.suffix} />
      </div>

      {/* Accent Line */}
      <div
        className="mt-2 h-1 w-10 rounded-full transition-all duration-[0.4s] ease-out group-hover:w-14"
        style={{ backgroundColor: accentColor }}
      />

      {/* Description */}
      <p className="mt-3 text-[14px] sm:text-[16px] md:text-[18px] font-semibold text-[#1F2937] leading-tight">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function HomeGlobal() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center lg:px-6">
          <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl text-[#1a5276]">
            The World Is Our Playground
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto mt-8 w-full max-w-[1200px] px-0 aspect-[16/9]"
          >
            <Image
              src="/images/Hero1.png"
              alt="Global presence map"
              fill
              className="rounded-2xl shadow-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              loading="lazy"
              quality={85}
            />
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 lg:py-20">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dot pattern in corners */}
          <div
            className="absolute top-0 left-0 w-32 h-32 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(${brandColors.blue} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(${brandColors.green} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(${brandColors.green} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(${brandColors.blue} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />

          {/* Blurred gradient blobs */}
          <div
            className="absolute top-20 left-10 w-64 h-64 rounded-full blur-[100px] opacity-[0.04]"
            style={{ backgroundColor: brandColors.blue }}
          />
          <div
            className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-[100px] opacity-[0.04]"
            style={{ backgroundColor: brandColors.green }}
          />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B5FA5]">
              KEY ASSETS OF KHM
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto">
              Delivering Excellence Through Innovation, Engineering & Global Trust
            </p>
            <div className="mt-4 sm:mt-5 mx-auto h-1 w-20 sm:w-24 bg-gradient-to-r from-[#0B5FA5] to-[#2BA84A] rounded-full" />
          </motion.div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {KEY_ASSETS.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
