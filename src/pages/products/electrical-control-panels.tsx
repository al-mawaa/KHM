import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, HelpCircle } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ELECTRICAL_CONTROL_PANELS } from "@/lib/products/electrical-control-panels";

export default function ElectricalControlPanelsPage() {
  const { heroImages, detailBlocks, faqs } = ELECTRICAL_CONTROL_PANELS;

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
          <span className="text-[#1a5276]">Electrical Control Panels</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="product-hero-collage"
          >
            <img
              src={heroImages.main}
              alt="Industrial electrical control panels installed in a plant"
              className="product-hero-main shadow-md"
              loading="eager"
            />
            <div className="flex flex-col gap-3">
              {heroImages.secondary.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={
                    i === 0
                      ? "Technicians wiring an electrical control panel"
                      : "Control panel installation at industrial site"
                  }
                  className="product-hero-side shadow-md"
                  loading="lazy"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-10 max-w-3xl text-center"
          >
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl lg:text-4xl">
              {ELECTRICAL_CONTROL_PANELS.title}
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-gray-600 sm:text-base">
              {ELECTRICAL_CONTROL_PANELS.intro}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex rounded-full bg-[#25a244] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
              >
                Enquire Now
              </Link>
              <Link
                to="/contact"
                className="inline-flex rounded-full bg-[#c0392b] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#a93226]"
              >
                Product Brochure
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature banner */}
      <section className="bg-[#1a5276] py-12 text-white lg:py-16">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14 lg:px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm leading-relaxed text-white/90 sm:text-base"
          >
            {ELECTRICAL_CONTROL_PANELS.valueProposition}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={ELECTRICAL_CONTROL_PANELS.valueImage}
              alt="Modern electrical control cabinets"
              className="product-img-pair w-full"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Detail blocks 01–04 */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            {detailBlocks.map((block, i) => (
              <motion.article
                key={block.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-gray-100 bg-[#f8fafc] p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl font-bold text-[#1a5276]/25 sm:text-4xl">{block.num}</span>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[#1a5276] sm:text-base">
                      {block.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{block.body}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-[#f4f6f8] py-12 lg:py-16">
        <div className="mx-auto max-w-[900px] px-4 lg:px-6">
          <h2 className="text-center font-display text-xl font-bold uppercase text-[#1a5276] sm:text-2xl">
            Frequently Asked Question
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`} className="border-gray-200 bg-white px-4">
                <AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold text-gray-800 hover:no-underline sm:text-base">
                  <span className="flex items-start gap-3">
                    <span
                      className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1a5276] text-white"
                      aria-hidden
                    >
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-10 text-sm leading-relaxed text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a5276] py-12 text-center text-white lg:py-14">
        <div className="mx-auto max-w-[900px] px-4 lg:px-6">
          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">
            Are you ready for a better more productive business?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
            Stop worrying about your water problems. Contact KHM Infra Innovations today for the best solutions for
            your business.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
