import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { smartCity } from "@/lib/images";
import {
  Home, Landmark, Factory, Hotel, HeartPulse, Building2,
  GraduationCap, Cpu, Cog,
} from "lucide-react";

const inds = [
  { icon: Home, name: "Residential Buildings", d: "Compact STPs and grey-water reuse for apartments, villas and townships." },
  { icon: Landmark, name: "Government Projects", d: "Municipal STPs, river rejuvenation and smart-city water infrastructure." },
  { icon: Factory, name: "Private Industries", d: "Effluent treatment, recovery and zero liquid discharge solutions." },
  { icon: Hotel, name: "Hotels & Resorts", d: "Discreet, high-reliability systems with reuse for landscaping." },
  { icon: HeartPulse, name: "Hospitals", d: "ETPs designed for medical waste streams with strict compliance." },
  { icon: Building2, name: "Commercial / Hospitality", d: "IT parks, malls and mixed-use developments." },
  { icon: GraduationCap, name: "Educational Institutes", d: "Campus-wide STP and harvesting systems." },
  { icon: Cpu, name: "Smart Cities", d: "IoT-enabled water grids, monitoring and analytics." },
  { icon: Cog, name: "Housing Societies", d: "Retrofit and AMC for existing society STPs." },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Solutions for every sector" description="From a single residential tower to a sprawling industrial estate — engineered to your context, capacity and compliance." image={smartCity} />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader eyebrow="Sectors" title="Where our engineering works" />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {inds.map((i) => (
              <div key={i.name} className="group rounded-2xl border border-border bg-card p-7 shadow-card hover-lift">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-aqua text-primary-foreground shadow-glow group-hover:scale-110 transition-transform">
                  <i.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{i.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
