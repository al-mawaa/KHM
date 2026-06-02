import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { CLIENT_NAMES } from "@/lib/home-content";

export function HomeClients() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <h2 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">
          Our Clients
        </h2>
        <div className="mt-10">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={16}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="clients-swiper"
          >
            {CLIENT_NAMES.map((name) => (
              <SwiperSlide key={name}>
                <div className="flex h-20 items-center justify-center rounded-lg border border-gray-200 bg-[#f4f6f8] px-4">
                  <span className="font-display text-lg font-bold tracking-wide text-[#1a5276]/80">{name}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
