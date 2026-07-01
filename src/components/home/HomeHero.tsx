import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const heroSlides = [
  "/images/file_0000000017107209bff0165912f3405b.png",
  "/images/file_000000000f40720c890aee0f78410d17.png",
  "/images/file_00000000a3587207869c1ff1e4408c21.png",
];

export function HomeHero() {
  return (
    <section
      className="relative w-full overflow-hidden home-hero-section"
      aria-label="Hero"
      style={{
        marginTop: "calc(var(--site-header-height, 0px) * -1)",
      }}
    >
      <Swiper
        className="h-full w-full hero-swiper"
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
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide}>
            <div className="relative h-full w-full">
              <Image
                src={slide}
                alt={`Hero slide ${index + 1}`}
                fill
                className="hero-bg-img object-cover"
                sizes="100vw"
                priority={index === 0}
                quality={85}
              />
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

        /* Responsive hero sizing - smooth breakpoints */
        .home-hero-section { height: 100vh; min-height: 600px; }
        @media (max-width: 1279px) { .home-hero-section { height: 85vh; min-height: 560px; } }
        @media (max-width: 1023px) { .home-hero-section { height: 82vh; min-height: 520px; } }
        @media (max-width: 767px) { .home-hero-section { height: 78vh; min-height: 460px; } }
        @media (max-width: 639px) { .home-hero-section { height: 70vh; min-height: 400px; } }
      `}</style>
    </section>
  );
}