import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, HelpCircle } from "lucide-react";

import { BlogCta } from "@/components/BlogCta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CLARIFIER_SYSTEM } from "@/lib/products/clarifier-system";

export default function ClarifierSystemPage() {
  const { heroImages, technologies, processSteps, systemsOffered, faqs } = CLARIFIER_SYSTEM;

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
          <span className="text-[#1a5276]">Clarifier System</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14 lg:px-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="product-hero-collage"
          >
            <img
              src={heroImages.main}
              alt="Clarifier system — circular settling tank"
              className="product-hero-main shadow-md"
              loading="eager"
            />
            <div className="flex flex-col gap-3">
              {heroImages.secondary.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === 0 ? "Industrial water treatment plant" : "Water treatment equipment"}
                  className="product-hero-side shadow-md"
                  loading="lazy"
                />
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1a5276] sm:text-3xl lg:text-4xl">
              {CLARIFIER_SYSTEM.title}
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-gray-600 sm:text-base">{CLARIFIER_SYSTEM.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex rounded-full bg-[#25a244] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
              >
                Get Quote
              </Link>
              <Link
                to="/contact"
                className="inline-flex rounded-full bg-[#c0392b] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#a93226]"
              >
                Download Brochure
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="bg-[#1a5276] py-12 text-white lg:py-16">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-xl font-bold uppercase sm:text-2xl">{technologies.heading}</h2>
            <ul className="mt-6 space-y-3">
              {technologies.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5c518]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-white/85 sm:text-base">{technologies.tagline}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="product-img-pair-grid"
          >
            {technologies.images.map((src, i) => (
              <div key={src} className="product-img-pair-cell shadow-lg">
                <img
                  src={src}
                  alt={i === 0 ? "Clarifier machinery" : "Clarifier piping and equipment"}
                  className="product-img-pair"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            {processSteps.map((step, i) => (
              <motion.article
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-gray-100 bg-[#f8fafc] p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl font-bold text-[#1a5276]/25 sm:text-4xl">{step.num}</span>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[#1a5276] sm:text-base">
                      {step.title}
                    </h3>
                    {"body" in step && step.body && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.body}</p>
                    )}
                    {"bullets" in step && step.bullets && (
                      <ul className="mt-3 space-y-2">
                        {step.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#1a5276]" aria-hidden />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Systems we offer */}
      <section className="border-t border-gray-100 bg-[#f4f6f8] py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <h2 className="text-center font-display text-xl font-bold uppercase text-[#1a5276] sm:text-2xl">
            Clarifier Systems We Offer
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {systemsOffered.map((system, i) => (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-lg bg-white shadow-md"
              >
                <img
                  src={system.image}
                  alt={system.title}
                  className="product-img-card"
                  loading="lazy"
                />
                <p className="border-t border-gray-100 px-4 py-4 text-center text-sm font-bold uppercase tracking-wide text-[#1a5276]">
                  {system.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[900px] px-4 lg:px-6">
          <h2 className="text-center font-display text-xl font-bold uppercase text-[#1a5276] sm:text-2xl">
            Frequently Asked Question
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`} className="border-gray-200">
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

      <BlogCta />
    </main>
  );
}
