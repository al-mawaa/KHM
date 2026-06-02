import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Check } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { HERO_SLIDES, type HeroSlideConfig } from "@/lib/home-content";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils";

const INSET_LAYOUT = [
  { className: "left-0 top-[8%] z-10 h-[92px] w-[92px] sm:h-[104px] sm:w-[104px]" },
  { className: "left-[30%] top-0 z-20 h-[108px] w-[108px] sm:h-[120px] sm:w-[120px]" },
  { className: "right-[22%] top-[16%] z-30 h-[96px] w-[96px] sm:h-[108px] sm:w-[108px]" },
  { className: "right-0 bottom-[2%] z-40 h-[100px] w-[100px] sm:h-[112px] sm:w-[112px]" },
] as const;

function HeroSlideShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("home-hero__slide relative w-full overflow-hidden", className)}>{children}</div>;
}

function HeroBannerSlide({
  src,
  alt,
  bgClass,
  fit = "cover",
}: {
  src: string;
  alt: string;
  bgClass: string;
  fit?: "cover" | "contain";
}) {
  return (
    <HeroSlideShell className={bgClass}>
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", fit === "contain" ? "object-contain object-center" : "home-hero-slide-img")}
        loading="lazy"
      />
      <Link
        to="/contact"
        className="absolute right-4 top-4 z-10 rounded bg-[#25a244] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-[#1f8a38] sm:right-6 sm:top-5"
      >
        Enquiry Now
      </Link>
    </HeroSlideShell>
  );
}

function HeroSlidePanel({ slide }: { slide: HeroSlideConfig }) {
  const isBlack = slide.theme === "black";
  const isMicro = slide.theme === "micro";
  const isAqua = slide.theme === "aqua";
  const isWide = slide.theme === "wide";
  const isBlue = slide.theme === "blue";
  const compactList = slide.items.length > 5;

  if (isAqua) {
    return (
      <HeroBannerSlide
        src={siteImages.heroWaterBlue}
        alt="Water Treatment Plant — Pure Water, Better Life, Sustainable Future"
        bgClass="bg-[#0a4a7a]"
      />
    );
  }

  if (isWide) {
    return (
      <HeroBannerSlide
        src={siteImages.heroWaterWide}
        alt="Water Treatment Plant — clarifier, filtration, softener, RO, desalination and demineralization systems"
        bgClass="bg-[#dceef8]"
        fit="contain"
      />
    );
  }

  if (slide.theme === "gradient") {
    return (
      <HeroBannerSlide
        src={siteImages.heroWaterGradient}
        alt="Water Treatment Plant — Pure Water, Better Life, Sustainable Future with full treatment systems"
        bgClass="bg-[#0a1628]"
        fit="contain"
      />
    );
  }

  const checkClass = isBlack
    ? "bg-[#00e676] text-black shadow-[0_0_10px_rgba(0,230,118,0.4)]"
    : "bg-[#25a244] text-white";

  const btnClass = isBlack
    ? "bg-[#00e676] text-black hover:bg-[#00c853]"
    : "bg-[#25a244] text-white hover:bg-[#1f8a38]";

  const hoverText = isBlack ? "hover:text-[#00e676]" : "hover:text-[#f5c518]";

  return (
    <HeroSlideShell>
      {isBlack && (
        <>
          <div className="absolute inset-0 bg-black" aria-hidden />
          <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#00e676]/20 blur-3xl" aria-hidden />
        </>
      )}
      {isMicro && (
        <>
          <img src={siteImages.heroSlideWtp} alt="" aria-hidden className="home-hero-slide-img absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12]/95 via-[#0a0a12]/80 to-[#0a0a12]/40" aria-hidden />
        </>
      )}
      {isBlue && (
        <>
          <img src={siteImages.heroSlide2} alt="" aria-hidden className="home-hero-slide-img absolute inset-0" />
          <div className="absolute inset-0 bg-[#0d3d5c]/85" aria-hidden />
        </>
      )}

      <div className="home-hero__content relative z-10 mx-auto grid h-full w-full max-w-[var(--home-hero-max-width,1600px)] grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-14 lg:px-10 lg:py-12">
        <div className="max-w-xl">
          {isBlue && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c518] sm:text-sm">KHM Infra Innovations</p>
          )}
          <h2
            className={cn(
              "font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl lg:text-[2.75rem]",
              isBlue && "mt-2",
            )}
          >
            {slide.title}
          </h2>
          <ul className={cn("mt-6", compactList ? "space-y-2" : "space-y-2.5")}>
            {slide.items.map((item) => (
              <li key={item}>
                <Link
                  to="/services"
                  className={cn(
                    "group flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-white/95 transition-colors sm:text-base",
                    isBlue && "font-medium normal-case",
                    hoverText,
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-transform group-hover:scale-105 sm:h-7 sm:w-7",
                      checkClass,
                    )}
                    aria-hidden
                  >
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
                  </span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className={cn("mt-8 inline-flex rounded px-8 py-3 text-sm font-bold uppercase tracking-wide transition-colors sm:mt-9", btnClass)}
          >
            Contact Us
          </Link>
        </div>

        {isBlack && (
          <div className="relative mx-auto hidden h-[260px] w-full max-w-md overflow-hidden sm:block lg:h-[300px] lg:max-w-lg">
            <img
              src={siteImages.waterTreatmentHero}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-[185%] max-w-none object-cover object-right"
              loading="lazy"
            />
          </div>
        )}

        {isMicro && (
          <div className="relative mx-auto hidden h-[260px] w-[320px] shrink-0 sm:block lg:h-[300px] lg:w-[380px]">
            {[
              { kind: "img" as const, src: siteImages.waterTreatmentA, layout: INSET_LAYOUT[0] },
              { kind: "img" as const, src: siteImages.waterTreatmentB, layout: INSET_LAYOUT[1] },
              { kind: "empty" as const, layout: INSET_LAYOUT[2] },
              { kind: "img" as const, src: siteImages.iot, layout: INSET_LAYOUT[3] },
            ].map((item, i) =>
              item.kind === "empty" ? (
                <div
                  key={`empty-${i}`}
                  className={cn("absolute rounded-full border-[3px] border-white/80", item.layout.className)}
                  aria-hidden
                />
              ) : (
                <div
                  key={item.src}
                  className={cn("absolute overflow-hidden rounded-full border-[3px] border-white/90 shadow-xl", item.layout.className)}
                >
                  <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ),
            )}
          </div>
        )}

        {isBlue && (
          <div className="relative mx-auto hidden h-[260px] w-[140px] shrink-0 flex-col justify-center gap-3 sm:flex lg:h-[300px] lg:w-[160px]">
            {[siteImages.etp, siteImages.waterRecycle, siteImages.iot].map((src, i) => (
              <div
                key={src}
                className={cn(
                  "overflow-hidden rounded-full border-[3px] border-white/90 shadow-xl",
                  i === 1 ? "ml-8 h-[84px] w-[84px] sm:h-[96px] sm:w-[96px]" : "h-[76px] w-[76px] sm:h-[84px] sm:w-[84px]",
                  i === 2 && "ml-4",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>
    </HeroSlideShell>
  );
}

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="home-hero relative w-full scroll-mt-[var(--site-header-height,4.75rem)]" aria-label="Hero">
      <Swiper
        className="home-hero-swiper w-full"
        modules={[Autoplay, Navigation, Pagination]}
        speed={reduceMotion ? 0 : 650}
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        navigation={!reduceMotion}
        pagination={{ clickable: true }}
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HeroSlidePanel slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
