import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const heroSlides = [
  "/images/Hero1.png",
  "/images/Hero2.png",
  "/images/Hero3.png",
  "/images/Hero4.png",
];

export function HomeHero() {
  const { settings } = useWebsiteSettings();

  return (
    <section className="relative h-[85vh] w-full overflow-hidden" aria-label="Hero">
      <Swiper
        className="h-full w-full"
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1200}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".hero-swiper-button-next",
          prevEl: ".hero-swiper-button-prev",
        }}
        pagination={{
          el: ".hero-swiper-pagination",
          clickable: true,
          bulletClass: "hero-swiper-pagination-bullet",
          bulletActiveClass: "hero-swiper-pagination-bullet-active",
        }}
        fadeEffect={{
          crossFade: true,
        }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide}>
            <div
              className="relative h-[85vh] w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="max-w-4xl text-center text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                    {settings.heroTitle}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-md">
                    {settings.heroSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="hero-swiper-button-prev absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50">
          <ChevronLeft className="h-6 w-6" />
        </div>
        <div className="hero-swiper-button-next absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50">
          <ChevronRight className="h-6 w-6" />
        </div>

        <div className="hero-swiper-pagination absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3" />
      </Swiper>

      <style>{`
        .hero-swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .hero-swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        .hero-swiper-pagination-bullet-active {
          width: 36px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </section>
  );
}
