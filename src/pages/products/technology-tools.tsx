import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { TECHNOLOGY_TOOLS } from "@/lib/technology-tools-content";
import { cn } from "@/lib/utils";

export default function TechnologyToolsPage() {
  const { title, intro, categories, cta } = TECHNOLOGY_TOOLS;

  return (
    <main className="bg-white text-gray-800">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#f4f6f8]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
          <Link to="/" className="transition-colors hover:text-[#1a5276]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <Link to="/services" className="transition-colors hover:text-[#1a5276]">
            Product
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <span className="text-[#1a5276]">{title}</span>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-gray-100 py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center lg:px-6">
          <h1 className="font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#1a5276]" />
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">{intro}</p>
        </div>
      </section>

      {/* 2×2 grid */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid gap-0 overflow-hidden rounded-xl border border-[#1a5276]/20 shadow-lg sm:grid-cols-2">
            {categories.map((category, i) => (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "tech-tools-quadrant border-[#1a5276]/15 p-6 sm:p-8",
                  i % 2 === 0 ? "border-r" : "",
                  i < 2 ? "border-b" : "",
                  category.variant === "blue" ? "bg-[#eef6fc]" : "bg-[#eef8ef]",
                )}
              >
                <div className="mb-4 overflow-hidden rounded-lg shadow-sm">
                  <img
                    src={category.image}
                    alt=""
                    className="h-32 w-full object-cover sm:h-36"
                    loading="lazy"
                  />
                </div>
                <h2
                  className={cn(
                    "text-base font-bold sm:text-lg",
                    category.variant === "blue" ? "text-[#1a5276]" : "text-[#2e7d32]",
                  )}
                >
                  {category.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {category.tools.map((tool) => (
                    <li key={tool} className="text-sm font-medium leading-snug text-gray-700">
                      {tool}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a5276] py-12 text-center text-white lg:py-14">
        <div className="mx-auto max-w-[900px] px-4 lg:px-6">
          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">{cta.title}</h2>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            {cta.button}
          </Link>
        </div>
      </section>
    </main>
  );
}
