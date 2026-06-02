import { motion } from "framer-motion";

const VIDEO_URL = "https://www.youtube.com/embed/J---aiyznGQ";

export function HomeVideo() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl"
        >
          Corporate Video
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-10 aspect-video max-w-4xl overflow-hidden rounded-lg border border-gray-200 shadow-elegant"
        >
          <iframe
            title="KHM Infra Innovations corporate video"
            src={VIDEO_URL}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
