import { motion } from "framer-motion";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-aqua/40 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
