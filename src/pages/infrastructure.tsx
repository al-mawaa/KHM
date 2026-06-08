import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Factory,
  Gauge,
  Package,
  Ruler,
  Truck,
} from "lucide-react";

import { INFRASTRUCTURE_CONTENT } from "@/lib/infrastructure-content";
import { engineers, etp, govt, iot, smartCity, waterRecycle } from "@/lib/images";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils";

const STAT_ICONS = [Ruler, Building2, Factory, Truck, Package, Gauge] as const;

const INFRA_IMAGES = {
  teamWork: [engineers, etp, govt, smartCity],
  manufacturing: [waterRecycle, smartCity, iot, etp],
  testing: [iot, engineers, waterRecycle, etp],
} as const;

export default function InfrastructurePage() {
  const { title, subtitle, stats, teamWork, designStandards, manufacturing, testing, qualityPolicy, cta } =
    INFRASTRUCTURE_CONTENT;

  return (
    <main className="bg-white text-gray-800">
      {/* Hero + breadcrumb */}
      <section className="infrastructure-page-hero" aria-label="Infrastructure">
        <img
          src={siteImages.aboutPlant}
          alt="Manufacturing facility illustration"
          className="infrastructure-page-hero__img"
          loading="eager"
        />
        <div className="infrastructure-page-hero__overlay" aria-hidden />
        <div className="infrastructure-page-hero__breadcrumb">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
            <Link to="/" className="transition-colors hover:text-[#1a5276]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#1a5276]">Infrastructure</span>
          </div>
        </div>
      </section>

      {/* Overview + stats */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 text-center lg:px-6">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-base font-semibold leading-relaxed text-gray-700 sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item, i) => {
              const Icon = STAT_ICONS[i] ?? Gauge;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="infra-stat-card mx-auto flex w-full max-w-[280px] flex-col items-center justify-center px-6 py-12 shadow-[0_12px_40px_-12px_rgba(26,82,118,0.18)]"
                >
                  <div
                    className={cn(
                      "mb-5 grid h-12 w-12 place-items-center rounded-full text-white shadow-md",
                      i % 2 === 0 ? "bg-[#e91e8c]" : "bg-[#1a5276]",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-base font-semibold text-[#1a5276]">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Power of team work */}
      <section className="border-t border-gray-100 bg-[#f8fafc] py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-2"
          >
            {INFRA_IMAGES.teamWork.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt=""
                className={cn(
                  "w-full rounded-lg object-cover shadow-md",
                  idx === 0 ? "col-span-2 h-44 sm:h-52" : "h-32 sm:h-36",
                )}
                loading="lazy"
              />
            ))}
          </motion.div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl">
              {teamWork.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">{teamWork.body}</p>
          </div>
        </div>
      </section>

      {/* Global design standards */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
          <div className="order-2 lg:order-1">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl">
              {designStandards.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">{designStandards.body}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 flex flex-wrap items-center justify-center gap-5 lg:order-2"
          >
            {designStandards.logos.map((logo) => (
              <div
                key={logo}
                className="grid h-20 min-w-[100px] place-items-center rounded-lg border border-gray-200 bg-white px-4 font-display text-sm font-bold uppercase text-[#1a5276] shadow-sm sm:h-24 sm:min-w-[120px] sm:text-base"
              >
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* End-to-end manufacturing */}
      <section className="border-t border-gray-100 bg-[#f8fafc] py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-2"
          >
            {INFRA_IMAGES.manufacturing.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt=""
                className={cn(
                  "w-full rounded-lg object-cover shadow-md",
                  idx === 0 ? "col-span-2 h-40 sm:h-48" : "h-32 sm:h-36",
                )}
                loading="lazy"
              />
            ))}
          </motion.div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl">
              {manufacturing.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">{manufacturing.body}</p>
          </div>
        </div>
      </section>

      {/* In-house testing */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl">
              {testing.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">{testing.body}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-2"
          >
            {INFRA_IMAGES.testing.map((src) => (
              <img key={src} src={src} alt="" className="h-36 w-full rounded-lg object-cover shadow-md" loading="lazy" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quality policy */}
      <section className="border-t border-gray-100 bg-[#f8fafc] py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <h2 className="text-center font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl">
            Quality Policy
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {qualityPolicy.map((doc) => (
              <motion.article
                key={doc.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-lg border-2 border-gray-200 bg-white p-8 shadow-lg"
              >
                <div className="border-b border-gray-200 pb-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1a5276]">
                    KHM Infra Innovations Pvt. Ltd.
                  </p>
                  <p className="mt-1 text-[10px] text-gray-500">Chakan, Pune, Maharashtra</p>
                </div>
                <h3 className="mt-6 text-center font-display text-sm font-bold uppercase text-gray-900">{doc.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{doc.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a5276] py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">{cta.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">{cta.body}</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            {cta.button}
          </Link>
        </div>
      </section>
    </main>
  );
}
