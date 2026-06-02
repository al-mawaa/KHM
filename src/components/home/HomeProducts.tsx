import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MANUFACTURING_PRODUCTS } from "@/lib/home-content";

export function HomeProducts() {
  return (
    <section className="bg-[#1a5276] py-14 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <h2 className="text-center font-display text-2xl font-bold uppercase text-white sm:text-3xl">
          Our Manufacturing Range
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MANUFACTURING_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.04 }}
            >
              <Link
                to={"to" in p && p.to ? p.to : "/services"}
                className="group block overflow-hidden rounded-sm bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="bg-[#f5c518] px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-[#1a5276] sm:text-sm">
                  {p.title}
                </div>
                <div className="overflow-hidden bg-white">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-40"
                    loading="lazy"
                  />
                </div>
                <div className="bg-[#154360] px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                  {p.title}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
