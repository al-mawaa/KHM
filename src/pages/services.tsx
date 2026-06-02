import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { SERVICE_CATEGORIES, SERVICES_PAGE } from "@/lib/services-content";
import { siteImages } from "@/lib/site-images";

export default function ServicesPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-[#f0f7fb] to-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276]/70">What we offer</p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase text-[#1a5276] sm:text-4xl">
                {SERVICES_PAGE.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">{SERVICES_PAGE.intro}</p>
              <Link
                to="/contact"
                className="mt-8 inline-flex rounded-full bg-[#25a244] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
              >
                Enquire Now
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img
                src={siteImages.etp}
                alt="Water and wastewater engineering services"
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
          <span className="text-[#1a5276]">Services</span>
        </div>
      </div>

      {/* Service categories */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="space-y-12">
            {SERVICE_CATEGORIES.map((category, i) => (
              <motion.article
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="scroll-mt-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md lg:grid lg:grid-cols-[280px_1fr] lg:gap-0"
              >
                <div className="relative h-48 overflow-hidden lg:h-auto lg:min-h-[220px]">
                  <img
                    src={category.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a5276]/80 via-[#1a5276]/30 to-transparent lg:bg-gradient-to-r" />
                  <h2 className="absolute bottom-4 left-4 right-4 font-display text-lg font-bold uppercase leading-snug text-white lg:bottom-6 lg:left-6">
                    {category.title}
                  </h2>
                </div>
                <div className="p-6 lg:p-8">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {category.services.map((service) => (
                      <li
                        key={service}
                        className="flex gap-2 text-sm leading-relaxed text-gray-700 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[#1a5276] before:content-['']"
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
          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">{SERVICES_PAGE.cta.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
            From Jal Jeevan Mission to PMC, O&amp;M and smart monitoring — we support your project across the full lifecycle.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            {SERVICES_PAGE.cta.button}
          </Link>
        </div>
      </section>
    </main>
  );
}
