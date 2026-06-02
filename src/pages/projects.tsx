import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { engineers, etp, govt, heroPlant, iot, rainwater, smartCity, waterRecycle } from "@/lib/images";

const categories = ["All", "Government", "Industrial", "Commercial", "Residential"] as const;

const items = [
  { img: govt, cat: "Government", t: "Municipal STP — 5 MLD", l: "Maharashtra" },
  { img: etp, cat: "Industrial", t: "Pharma ETP with ZLD", l: "Hinjawadi, Pune" },
  { img: heroPlant, cat: "Government", t: "Sewage Treatment Plant — 10 MLD", l: "Smart City Project" },
  { img: smartCity, cat: "Commercial", t: "IT Park Water Recycling", l: "Pune" },
  { img: rainwater, cat: "Residential", t: "Housing Society Harvesting", l: "Bhugaon" },
  { img: waterRecycle, cat: "Commercial", t: "Hotel Recycling Loop", l: "Lonavala" },
  { img: iot, cat: "Industrial", t: "IoT Monitoring Retrofit", l: "Chakan MIDC" },
  { img: engineers, cat: "Government", t: "Civic Infrastructure Upgrade", l: "Mulshi" },
];

export default function ProjectsPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const filtered = active === "All" ? items : items.filter((i) => i.cat === active);

  return (
    <>
      <PageHero eyebrow="Projects" title="A portfolio engineered for impact" description="Selected projects spanning government infrastructure, industrial plants and large commercial assets." image={heroPlant} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  active === c
                    ? "bg-gradient-aqua text-primary-foreground shadow-glow"
                    : "border border-border bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl shadow-card hover-lift">
                <img src={p.img} alt={p.t} loading="lazy" width={1280} height={960} className="h-72 w-full object-cover hover-zoom" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                  <span className="inline-block rounded-full bg-aqua/30 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">{p.cat}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{p.t}</h3>
                  <p className="text-xs text-primary-foreground/80">{p.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
