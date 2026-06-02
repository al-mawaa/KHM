import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, FileText } from "lucide-react";

import { CLIENT_FILTERS, CUSTOMERS, type ClientFilterId } from "@/lib/clients-content";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const [active, setActive] = useState<ClientFilterId>("worldwide");

  const filtered = useMemo(() => {
    if (active === "worldwide") return CUSTOMERS;
    return CUSTOMERS.filter((c) => c.industries.includes(active));
  }, [active]);

  return (
    <main className="bg-white text-gray-800">
      {/* Hero banner */}
      <section className="clients-page-hero" aria-label="Clients">
        <img
          src={siteImages.clientsHero}
          alt="Engineering team reviewing project plans at an industrial site"
          className="clients-page-hero__img"
          loading="eager"
        />
        <div className="clients-page-hero__overlay" aria-hidden />
        <div className="clients-page-hero__breadcrumb">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
            <Link to="/" className="transition-colors hover:text-[#1a5276]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
            <span className="text-[#1a5276]">Clients</span>
          </div>
        </div>
      </section>

      {/* Customers */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">Customers</h1>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">Browse Through Few Of Our Customers</p>
          </motion.div>

          {/* Industry filters */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CLIENT_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActive(filter.id)}
                className={cn(
                  "rounded border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors sm:px-4 sm:text-[13px]",
                  active === filter.id
                    ? "border-[#1a5276] bg-[#1a5276] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#1a5276]/40 hover:text-[#1a5276]",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Logo grid */}
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 rounded-lg border border-gray-100 bg-white p-4 shadow-md sm:p-6 lg:p-8"
          >
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-gray-500">No customers found for this category.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filtered.map((customer) => (
                  <div
                    key={customer.name}
                    className="flex h-24 items-center justify-center rounded-md border border-gray-100 bg-[#fafbfc] px-3 text-center shadow-sm sm:h-28"
                  >
                    <span className="font-display text-sm font-bold leading-tight text-[#1a5276]/85 sm:text-base">
                      {customer.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a5276] py-12 text-center text-white lg:py-14">
        <div className="mx-auto max-w-[900px] px-4 lg:px-6">
          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">
            Are you ready for a better more productive business?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
            Stop worrying about treatment solution for water &amp; wastewater. Focus on your business. Let us provide
            the solution you deserve.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Get a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
