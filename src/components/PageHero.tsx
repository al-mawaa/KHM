import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumb?: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, breadcrumb, backgroundImage = "/images/hero-plant.jpg" }: PageHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px]"
      style={{
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
          {breadcrumb && (
            <div className="mb-4 sm:mb-5 flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <span>{breadcrumb}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-bold leading-[1.1] text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[60px]">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-[800px] leading-[1.7] text-sm sm:text-base md:text-lg lg:text-xl text-white/90">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
