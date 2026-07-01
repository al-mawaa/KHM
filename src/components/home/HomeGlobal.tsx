import { motion } from "framer-motion";
import Image from "next/image";
import { Counter } from "@/components/Counter";
import { KEY_ASSETS } from "@/lib/home-content";

export function HomeGlobal() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center lg:px-6">
          <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl text-[#1a5276]">
            The World Is Our Playground
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto mt-8 w-full max-w-[1200px] px-0 aspect-[16/9]"
          >
            <Image
              src="/images/Hero1.png"
              alt="Global presence map"
              fill
              className="rounded-2xl shadow-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              loading="lazy"
              quality={85}
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <h2 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">
            Key Assets of KHM
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {KEY_ASSETS.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="grid h-28 w-28 place-items-center rounded-full text-white shadow-md sm:h-32 sm:w-32"
                  style={{ backgroundColor: stat.color }}
                >
                  <span className="font-display text-2xl font-bold sm:text-3xl">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="mt-4 max-w-[220px] text-sm font-medium text-gray-700">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
