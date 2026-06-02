import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { SECTORS_WE_SERVE } from "@/lib/sectors-content";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils";

export default function SectorsWeServePage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-[#f0f7fb] to-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276]/70">What we do</p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase text-[#1a5276] sm:text-4xl lg:text-5xl">
                Sectors We Serve
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                KHM Infra Innovations delivers precision-engineered infrastructure and consultancy across water,
                sewerage, civil, real estate, power, and project management — supporting government missions and private
                development nationwide.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex rounded-full bg-[#25a244] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
              >
                Discuss Your Project
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img
                src={siteImages.heroPlant}
                alt="Infrastructure and water treatment projects"
                className="h-56 w-full object-cover sm:h-72 lg:h-80"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#f4f6f8]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
          <Link to="/" className="transition-colors hover:text-[#1a5276]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <span className="text-[#1a5276]">Sectors We Serve</span>
        </div>
      </div>

      {/* Sectors grid */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <h2 className="font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">Sectors We Serve</h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS_WE_SERVE.map((sector, i) => (
              <motion.article
                key={sector.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "sector-card overflow-hidden rounded-lg border shadow-md",
                  sector.variant === "blue"
                    ? "border-[#1a5276]/15 bg-[#eef6fc]"
                    : "border-[#2e7d32]/15 bg-[#eef8ef]",
                )}
              >
                <div className="relative h-40 overflow-hidden sm:h-44">
                  <img
                    src={sector.image}
                    alt={sector.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span
                    className={cn(
                      "absolute bottom-3 left-3 rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white",
                      sector.variant === "blue" ? "bg-[#1a5276]" : "bg-[#2e7d32]",
                    )}
                  >
                    {sector.label}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className={cn(
                      "text-sm font-bold uppercase tracking-wide",
                      sector.variant === "blue" ? "text-[#1a5276]" : "text-[#2e7d32]",
                    )}
                  >
                    {sector.title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {sector.services.map((service) => (
                      <li
                        key={service}
                        className="border-b border-black/5 pb-2 text-sm font-medium text-gray-700 last:border-0 last:pb-0"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a5276] py-12 text-center text-white lg:py-14">
        <div className="mx-auto max-w-[900px] px-4 lg:px-6">
          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">
            Need expertise in your sector?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
            From Jal Jeevan Mission to industrial ETP and PMC services — we support your project from feasibility to
            long-term O&amp;M.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
