import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function HomeCta() {
  return (
    <section className="bg-[#1a5276] py-14 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-4 text-center lg:flex-row lg:px-6 lg:text-left"
      >
        <h2 className="max-w-2xl font-display text-xl font-bold uppercase leading-snug text-white sm:text-2xl lg:text-3xl">
          Are you ready for a better, more productive business?
        </h2>
        <Link
          to="/contact"
          className="shrink-0 rounded bg-[#25a244] px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
        >
          Contact Us
        </Link>
      </motion.div>
    </section>
  );
}
