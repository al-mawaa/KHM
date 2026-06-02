import { motion } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { iot } from "@/lib/images";

const steps = [
  { n: "01", t: "Screening & Equalization", d: "Removal of solids and flow buffering." },
  { n: "02", t: "Primary Treatment", d: "Sedimentation and oil/grease separation." },
  { n: "03", t: "Biological Reactor", d: "MBBR / MBR / SBR for organic load reduction." },
  { n: "04", t: "Tertiary Filtration", d: "Pressure sand & activated carbon polishing." },
  { n: "05", t: "Disinfection", d: "UV and chlorination to safe reuse standards." },
  { n: "06", t: "Smart Monitoring", d: "IoT dashboards, alarms and remote diagnostics." },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow="Technology" title="Smart, automated, sustainable" description="A modern treatment train built on proven bioprocesses and real-time intelligence." image={iot} />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader eyebrow="Process" title="Our treatment flow" description="A six-stage train tuned to your inflow characteristics and reuse goals." />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="relative rounded-2xl border border-border bg-card p-7 shadow-card hover-lift"
              >
                <div className="font-display text-5xl font-bold text-gradient">{s.n}</div>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-3xl shadow-elegant">
            <img src={iot} alt="IoT water monitoring" loading="lazy" width={1280} height={960} className="h-[480px] w-full object-cover hover-zoom" />
          </div>
          <div>
            <SectionHeader align="left" eyebrow="Smart Monitoring" title="Real-time intelligence, anywhere" description="A unified IoT platform gives operators and owners live visibility into every parameter that matters — from BOD/COD to energy draw." />
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {["Live flow & quality", "Energy analytics", "Predictive maintenance", "Compliance reports", "Remote alarms", "Mobile dashboards"].map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-aqua" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
