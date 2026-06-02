import { motion } from "framer-motion";
import { siteImages } from "@/lib/site-images";

export function HomeAbout() {
  return (
    <section id="about" className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[3fr_2fr] lg:gap-14 lg:px-10 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl lg:max-w-none"
        >
          <span className="inline-block rounded-sm bg-[#f5c518] px-3 py-1.5 text-xs font-semibold text-white sm:px-3.5 sm:py-2 sm:text-sm">
            Water &amp; Wastewater Treatment
          </span>
          <h2 className="mt-5 font-display text-xl font-bold uppercase leading-snug tracking-tight text-gray-900 sm:text-2xl lg:text-[1.85rem] lg:leading-tight">
            Advanced Engineering for Water &amp; Wastewater Treatment System
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#757575] sm:text-[15px] sm:leading-7">
            With growing global demand for clean water, advanced water treatment technologies play a vital role in
            ensuring safe drinking water, industrial process water and environmental compliance. Wastewater treatment
            protects ecosystems, supports reuse and helps industries meet regulatory standards. KHM Infra Innovations
            is committed to delivering ground-breaking engineering solutions for complete water and wastewater
            treatment systems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex w-full items-center justify-center lg:justify-end"
        >
          <div className="home-about-visual shrink-0">
            <img
              src={siteImages.aboutPlant}
              alt="Water treatment plant — intake, clarification, filtration, storage and distribution"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
