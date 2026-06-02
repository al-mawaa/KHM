import { useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { TESTIMONIALS } from "@/lib/home-content";

export function HomeTestimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#f4f6f8] py-14 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <h2 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">
          Testimonials
        </h2>
        <div className="testimonials-swiper relative mt-10">
          <Swiper
            modules={[Navigation]}
            navigation={!reduceMotion}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            className="!pb-2"
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide key={t.name}>
                <article className="relative h-full rounded-lg border border-gray-200 bg-white p-8 pt-12 shadow-sm">
                  <Quote className="absolute left-6 top-4 h-10 w-10 text-[#b8d4e8]" fill="currentColor" />
                  <p className="relative text-sm leading-relaxed text-gray-600 italic">“{t.quote}”</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#1a5276] text-sm font-bold text-white">
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a5276]">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.company}</p>
                    </div>
                  </div>
                  <Quote className="absolute bottom-4 right-6 h-8 w-8 rotate-180 text-gray-200" />
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
