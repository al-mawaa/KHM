import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { siteImages } from "@/lib/site-images";

export function HomeProject() {
  return (
    <section className="border-y border-gray-200 bg-[#f4f6f8] py-14 lg:py-16">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-lg shadow-elegant"
        >
          <div className="aspect-[16/9] w-full">
            <img
              src={siteImages.projectBuilding}
              alt="KHM Infra Innovations office"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold uppercase text-[#1a5276] sm:text-2xl lg:text-[1.65rem]">
            KHM Infra Innovations Pvt. Ltd.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
            Our integrated manufacturing and project execution capabilities enable turnkey delivery of water treatment
            plants — from compact housing society STPs to large industrial ETP and ZLD installations with IoT monitoring
            and 24/7 engineering support.
          </p>
          <Link
            to="/projects"
            className="mt-6 inline-block text-sm font-semibold text-[#1a5276] underline-offset-4 hover:underline"
          >
            View featured projects →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
