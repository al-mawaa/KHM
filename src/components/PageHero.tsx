import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, breadcrumb, backgroundImage = "/images/hero-plant.jpg" }: PageHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "350px",
        marginTop: "calc(var(--site-header-height, 0px) * -1)",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(rgba(5,38,74,0.85), rgba(5,38,74,0.65))",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Breadcrumb */}
          <div
            className="mb-5 flex items-center gap-2 text-sm"
            style={{
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <span>{breadcrumb}</span>
          </div>

          {/* Title */}
          <h1
            className="font-bold leading-[1.1] text-white"
            style={{
              fontSize: "60px",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className="mt-4 max-w-[800px] leading-[1.7]"
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          section {
            height: 300px !important;
          }
          h1 {
            font-size: 48px !important;
          }
          p {
            font-size: 18px !important;
          }
        }
        @media (max-width: 640px) {
          section {
            height: 250px !important;
          }
          h1 {
            font-size: 36px !important;
          }
          p {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
