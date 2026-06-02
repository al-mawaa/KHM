import { motion } from "framer-motion";

export function PageHero({ eyebrow, title, description, image }: { eyebrow?: string; title: string; description?: string; image?: string }) {
  return (
    <section className="relative py-16 pb-20 overflow-hidden bg-gradient-hero text-primary-foreground md:py-20">
      {image && (
        <div className="absolute inset-0 -z-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-aqua/40 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua animate-pulse" />
              {eyebrow}
            </span>
          )}
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">{title}</h1>
          {description && <p className="mt-5 text-lg text-primary-foreground/80 max-w-2xl">{description}</p>}
        </motion.div>
      </div>
    </section>
  );
}
