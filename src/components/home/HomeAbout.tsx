import { motion } from "framer-motion";
import { siteImages } from "@/lib/site-images";

export function HomeAbout() {
  return (
    <section id="about" className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-4 sm:px-5 md:px-8 lg:grid-cols-[3fr_2fr] lg:gap-14 lg:px-10 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl lg:max-w-none"
        >
          <span className="inline-block rounded-sm bg-[#f5c518] px-2.5 py-1 text-xs font-semibold text-white sm:px-3 sm:py-1.5 sm:text-sm md:px-3.5 md:py-2">
            Water &amp; Wastewater Treatment
          </span>
          <h2 className="mt-4 sm:mt-5 font-display text-lg font-bold uppercase leading-snug tracking-tight text-gray-900 sm:text-xl md:text-2xl lg:text-[1.85rem] lg:leading-tight">
            Advanced Engineering for Water &amp; Wastewater Treatment System
          </h2>
          <p className="mt-4 sm:mt-6 text-sm leading-relaxed text-[#757575] sm:text-[15px] sm:leading-7 md:text-base">
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
          <div className="w-full max-w-[680px] lg:max-w-full">
            <img
              src={siteImages.treatment}
              alt="Water treatment plant — intake, clarification, filtration, storage and distribution"
              loading="lazy"
              className="w-full h-auto object-cover rounded-2xl shadow-xl ring-1 ring-[#1a5276]/20"
              style={{ borderRadius: "16px" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
