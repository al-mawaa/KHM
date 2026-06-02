/**
 * Premium full-viewport hero with Swiper (auto-play, fade, parallax) + Framer Motion.
 * Stack: React + Vite + Tailwind + Framer Motion + Swiper — matches KHM logo flow (eco green + aqua + deep navy).
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Autoplay, EffectFade, Navigation, Pagination, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  ArrowRight,
  Award,
  Calendar,
  ChevronDown,
  Cpu,
  Droplets,
  Factory,
  Globe,
  Headphones,
  Leaf,
  Mouse,
  Recycle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/parallax";

import { Counter } from "@/components/Counter";
import { openQuoteInquiry } from "@/lib/open-quote";
import { cn } from "@/lib/utils";

import { engineers, etp, govt, heroPlant, iot, rainwater, smartCity, waterRecycle } from "@/lib/images";

const SLIDES = [
  { src: heroPlant, alt: "Water treatment plant — engineered infrastructure" },
  { src: etp, alt: "Industrial effluent and wastewater treatment systems" },
  { src: waterRecycle, alt: "Water recycling and closed-loop treatment" },
  { src: govt, alt: "Municipal and industrial water infrastructure" },
  { src: smartCity, alt: "Smart engineering and monitoring systems" },
  { src: rainwater, alt: "Rainwater harvesting and environmental systems" },
  { src: iot, alt: "IoT dashboards and smart water management" },
  { src: engineers, alt: "Engineering team and field execution" },
] as const;

const STATS = [
  { icon: Factory, value: 5500, suffix: "+", label: "Projects Installed" },
  { icon: Sparkles, value: 2200, suffix: "+", label: "Happy Clients" },
  { icon: Globe, value: 39, suffix: "+", label: "Countries Served" },
  { icon: Calendar, value: 19, suffix: "+", label: "Years Experience" },
] as const;

const FLOAT_INFO = [
  { icon: ShieldCheck, label: "ISO Certified", sub: "Quality systems" },
  { icon: Recycle, label: "Zero Liquid Discharge", sub: "ZLD expertise" },
  { icon: Cpu, label: "Smart Water Management", sub: "IoT & analytics" },
  { icon: Headphones, label: "24/7 Engineering Support", sub: "Always on call" },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroSwiperBanner() {
  const reduceMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 8 : 18 }, (_, i) => ({
        id: i,
        left: `${(i * 7 + 13) % 100}%`,
        top: `${(i * 11 + 7) % 100}%`,
        delay: (i % 7) * 0.35,
        duration: 4 + (i % 5),
      })),
    [reduceMotion],
  );

  return (
    <section
      className="relative isolate min-h-[100svh] w-full overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Swiper full-bleed background */}
      <div className="absolute inset-0 min-h-full">
        <Swiper
          className="hero-swiper !absolute inset-0 h-full w-full"
          modules={[Autoplay, EffectFade, Navigation, Pagination, Parallax]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={reduceMotion ? 0 : 1100}
          loop
          parallax
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={reduceMotion ? false : true}
          pagination={{ clickable: true, dynamicBullets: true }}
          grabCursor
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.src + index} className="!h-full">
              <div className="relative h-full min-h-[100svh] w-full overflow-hidden">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={1920}
                  height={1080}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  className="hero-bg-img absolute inset-0 h-full w-full object-cover"
                  data-swiper-parallax={reduceMotion ? undefined : "-8%"}
                />
                {/* Green-forward industrial overlay (logo: leaf green + aqua + navy) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#041a12]/92 via-[#062a1f]/88 to-[#0a1f2e]/90"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_20%_20%,oklch(0.72_0.16_155/0.35),transparent_55%),radial-gradient(ellipse_70%_50%_at_85%_30%,oklch(0.72_0.14_210/0.22),transparent_50%)]"
                  aria-hidden
                />
                {/* Grid + blueprint */}
                <div
                  className="absolute inset-0 opacity-[0.12] mix-blend-soft-light"
                  style={{
                    backgroundImage: `
                      linear-gradient(oklch(0.9 0.02 155 / 0.35) 1px, transparent 1px),
                      linear-gradient(90deg, oklch(0.9 0.02 155 / 0.35) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                  }}
                  aria-hidden
                />
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
                  aria-hidden
                >
                  <defs>
                    <pattern id="hero-blueprint" width="120" height="120" patternUnits="userSpaceOnUse">
                      <path d="M0 60 L120 60 M60 0 L60 120" stroke="oklch(0.85 0.08 155)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hero-blueprint)" />
                </svg>
                {/* Water ripples */}
                {!reduceMotion && (
                  <>
                    <div className="pointer-events-none absolute left-[12%] top-[22%] h-48 w-48 rounded-full border border-emerald-400/25 animate-ripple" />
                    <div className="pointer-events-none absolute right-[18%] bottom-[28%] h-36 w-36 rounded-full border border-cyan-300/20 animate-ripple [animation-delay:1.2s]" />
                  </>
                )}
                {/* Particles */}
                {!reduceMotion &&
                  particles.map((p) => (
                    <motion.span
                      key={p.id}
                      className="pointer-events-none absolute h-1 w-1 rounded-full bg-emerald-300/50 shadow-[0_0_8px_oklch(0.85_0.12_155/0.6)]"
                      style={{ left: p.left, top: p.top }}
                      animate={{ y: [0, -18, 0], opacity: [0.25, 0.85, 0.25] }}
                      transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                    />
                  ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Soft glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,oklch(0.55_0.14_165/0.35),transparent_45%)]"
          aria-hidden
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-16 pt-6 lg:px-8 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] lg:items-center">
          <motion.div
            variants={reduceMotion ? undefined : container}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? false : "show"}
            className="max-w-3xl"
          >
            <motion.div variants={reduceMotion ? undefined : item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100 shadow-[0_0_24px_oklch(0.72_0.16_155/0.25)] backdrop-blur-md">
                <Leaf className="h-3.5 w-3.5 text-emerald-300" aria-hidden />
                Trusted Water &amp; Wastewater Engineering Experts
              </span>
            </motion.div>

            <motion.h1
              variants={reduceMotion ? undefined : item}
              className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              <span className="block">Advanced</span>
              <span className="mt-1 block bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-sm">
                Water
              </span>
              <span className="mt-1 block bg-gradient-to-r from-cyan-100 via-emerald-200 to-emerald-300 bg-clip-text text-transparent">
                &amp; Wastewater
              </span>
              <span className="mt-1 block text-white/95">Treatment Solutions</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : item}
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
            >
              Delivering sustainable and high-performance industrial water treatment systems for infrastructure,
              manufacturing, and global industries.
            </motion.p>

            <motion.div variants={reduceMotion ? undefined : item} className="mt-8 flex flex-wrap gap-3">
              <motion.button
                type="button"
                onClick={() => openQuoteInquiry("Consultation")}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_oklch(0.65_0.14_165/0.45)]"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <span className="pointer-events-none absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                Get Free Consultation
                <ArrowRight className="relative h-4 w-4" />
              </motion.button>

              <Link
                to="/projects"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-emerald-300/50 hover:bg-white/15"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 shadow-[inset_0_0_0_1px_oklch(0.85_0.12_155/0.4)] transition-opacity group-hover:opacity-100" />
                Explore Projects
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={reduceMotion ? undefined : item}
              className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-4xl"
            >
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  className="group rounded-2xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-emerald-400/35 hover:shadow-[0_12px_40px_-12px_oklch(0.4_0.12_165/0.45)]"
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <s.icon className="h-5 w-5 text-emerald-300" aria-hidden />
                  <div className="mt-2 font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/65">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — decorative industrial stack */}
          <div className="relative hidden min-h-[280px] lg:block">
            <motion.div
              className="absolute -right-4 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/25 via-cyan-500/15 to-transparent blur-3xl"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute right-8 top-8 h-32 w-32 rounded-full border border-emerald-400/20"
              animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <svg
              viewBox="0 0 320 400"
              className="relative ml-auto h-[360px] w-[280px] text-emerald-300/40"
              aria-hidden
            >
              <defs>
                <linearGradient id="pipeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.75 0.14 165)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="oklch(0.65 0.12 200)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect x="40" y="40" width="200" height="24" rx="6" fill="currentColor" opacity="0.35" />
              <rect x="40" y="100" width="160" height="18" rx="5" fill="currentColor" opacity="0.25" />
              <rect x="40" y="150" width="220" height="18" rx="5" fill="url(#pipeGlow)" opacity="0.4" />
              <path
                d="M 60 220 L 260 220 L 260 320 L 80 320 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.35"
              />
              <motion.circle
                cx="200"
                cy="260"
                r="36"
                fill="oklch(0.72 0.14 200 / 0.15)"
                animate={reduceMotion ? undefined : { opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
            </svg>
            {/* Animated flow lines */}
            {!reduceMotion && (
              <svg className="pointer-events-none absolute right-12 top-24 h-40 w-32 text-cyan-300/50" aria-hidden>
                <motion.path
                  d="M 8 8 Q 40 80 8 160"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </svg>
            )}
          </div>
        </div>

        {/* Floating info cards — desktop */}
        <div className="pointer-events-none absolute inset-x-0 top-[clamp(6rem,18vw,9rem)] z-20 hidden h-[calc(100%-4rem)] max-w-[1600px] xl:block">
          {FLOAT_INFO.map((card, i) => (
            <motion.div
              key={card.label}
              className={cn(
                "pointer-events-auto absolute max-w-[200px] rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl backdrop-blur-md",
                i === 0 && "left-[2%] top-[18%]",
                i === 1 && "right-[4%] top-[22%]",
                i === 2 && "left-[3%] bottom-[26%]",
                i === 3 && "right-[3%] bottom-[20%]",
              )}
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -10, 0], rotate: i % 2 === 0 ? [0, 0.6, 0] : [0, -0.6, 0] }
              }
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              <card.icon className="h-4 w-4 text-emerald-300" />
              <div className="mt-1.5 text-xs font-bold text-white">{card.label}</div>
              <div className="text-[10px] text-white/65">{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: compact floating chips */}
        <div className="mt-8 flex flex-wrap gap-2 xl:hidden">
          {FLOAT_INFO.map((card) => (
            <div
              key={card.label}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-md"
            >
              <card.icon className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
              {card.label}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <a
          href="#about"
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-emerald-200"
        >
          <Mouse className="h-6 w-6 opacity-80" aria-hidden />
          <span className="sr-only">Scroll to content</span>
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
        </a>
      </div>

      {/* Ripple CTA pulse ring (decorative) */}
      <div className="pointer-events-none absolute bottom-24 left-[12%] hidden h-24 w-24 rounded-full border border-emerald-400/20 lg:block" aria-hidden />
    </section>
  );
}
