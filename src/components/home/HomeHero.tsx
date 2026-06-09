import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const heroSlides = [
  "/images/Hero1.png",
  "/images/Hero2.png",
  "/images/Hero3.png",
  "/images/Hero4.png",
];

export function HomeHero() {
  return (
    <section
      className="relative w-full overflow-hidden home-hero-section"
      aria-label="Hero"
      style={{
        height: "calc(100vh - var(--site-header-height, 0px))",
        marginTop: "calc(var(--site-header-height, 0px) * -1)",
      }}
    >
      <Swiper
        className="h-full w-full"
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1200}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        /* navigation removed to disable left/right arrows for a cleaner hero */
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
                className="relative h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide})`,
                  backgroundPosition: "center top",
                }}
              >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
            </div>
          </SwiperSlide>
        ))}

        {/* navigation buttons intentionally removed */}

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

        /* Responsive hero sizing */
        .home-hero-section { height: calc(100vh - var(--site-header-height, 0px)); }
        @media (max-width: 1024px) { .home-hero-section { height: calc(85vh - var(--site-header-height, 0px)); } }
        @media (max-width: 640px) { .home-hero-section { height: auto; min-height: 360px; padding: 2.5rem 0; } .home-hero-section .h-full { min-height: 360px; } }
      `}</style>
    </section>
  );
}
