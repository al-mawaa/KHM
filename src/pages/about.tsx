import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Counter } from "@/components/Counter";
import { ABOUT_US, OUR_VISION, OUR_MISSION } from "@/lib/about-content";
import { rainwater, heroPlant } from "@/lib/images";
import { Award, CheckCircle2, Leaf, Target, Users, Eye, Sparkles, Linkedin } from "lucide-react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { TeamTree } from "@/components/TeamTree";
import { useAdminCollection } from "@/lib/admin-store";

interface TeamMember {
  _id: string;
  fullName: string;
  designation: string;
  profileImage?: string;
  bio?: string;
  linkedinUrl?: string;
  displayOrder: number;
  status: string;
}

function DirectorsSection() {
  const [team] = useAdminCollection("team");

  const directors = team.filter((member) => member.isDirector === true);

  // Fallback to static if no directors marked yet
  const displayList =
    directors.length > 0
      ? directors
      : [
          {
            id: "1",
            name: "Hrishikesh Madhav Kaluskar",
            role: "Director & Co-Founder",
            designation: "Director & Co-Founder",
            bio: "",
            isDirector: true,
          },
          {
            id: "2",
            name: "Smita Hrishikesh Kaluskar",
            role: "Director & Co-Founder",
            designation: "Director & Co-Founder",
            bio: "",
            isDirector: true,
          },
        ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow="Leadership" title="Meet the directors" />
        <div
          className={`mt-12 grid gap-6 max-w-3xl mx-auto ${displayList.length === 1 ? "sm:grid-cols-1 justify-center" : "sm:grid-cols-2"}`}
        >
          {displayList.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {d.image ? (
                <img
                  src={d.image}
                  alt={d.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-[#1a5276]/20"
                />
              ) : (
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#1a5276] font-display text-3xl font-bold text-white">
                  {d.name
                    .split(" ")
                    .map((s: string) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div className="mt-4 font-display text-xl font-semibold text-[#1a5276]">{d.name}</div>
              <div className="text-sm text-gray-500">{d.designation || d.role}</div>
              {d.bio && <p className="mt-2 text-xs text-gray-400 line-clamp-2">{d.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  useVisitorTracking("About");

  const [directors, setDirectors] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Fetch active team members sorted by displayOrder
    fetch("/api/team-members")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // Filter to legacy team members who have a fullName
          const legacyOnly = data.data.filter((d: any) => d.fullName);
          setDirectors(legacyOnly);
        }
      })
      .catch(() => {
        // Silently fail – section will simply show empty
      });
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.replace("#", "");
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const initials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <PageHero
        title="Building India's water-secure infrastructure"
        subtitle="We are an engineering-led waste water and infrastructure company combining proven process technology with sustainable design and digital intelligence."
        backgroundImage={heroPlant}
      />

      <section id="about-us" className="scroll-mt-32 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-3xl shadow-elegant">
            <img
              src={rainwater}
              alt="KHM Rainwater Harvesting"
              className="w-full h-[520px] object-cover hover-zoom"
              loading="lazy"
              width={1280}
              height={960}
            />
          </div>
          <div>
            <SectionHeader align="left" eyebrow="Company" title={ABOUT_US.title} />
            <div className="mt-6 space-y-4">
              {ABOUT_US.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">CIN {ABOUT_US.cin}</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Target,
                  t: "Mission",
                  d: "Engineer sustainable water systems for every community we serve.",
                },
                {
                  icon: Eye,
                  t: "Vision",
                  d: "India's most trusted partner for sustainable water and wastewater infrastructure.",
                },
                {
                  icon: Leaf,
                  t: "Sustainability",
                  d: "Low-carbon designs and circular water principles.",
                },
                {
                  icon: Award,
                  t: "Excellence",
                  d: "Compliance-first, lifecycle-optimised engineering.",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card hover-lift"
                >
                  <b.icon className="h-6 w-6 text-aqua" />
                  <div className="mt-3 font-display font-semibold">{b.t}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="vision"
        className="scroll-mt-32 border-t border-border bg-[#f8fafc] py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeader align="left" eyebrow="Company" title={OUR_VISION.title} />
              <p className="mt-6 text-base font-medium leading-relaxed text-foreground">
                {OUR_VISION.lead}
              </p>
              <div className="mt-6 space-y-4">
                {OUR_VISION.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <h3 className="font-display text-lg font-semibold text-[#1a5276]">
                What we work toward
              </h3>
              <ul className="mt-6 space-y-4">
                {OUR_VISION.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-aqua" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="scroll-mt-32 border-t border-border bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <h3 className="font-display text-lg font-semibold text-[#1a5276]">What we deliver</h3>
              <ul className="mt-6 space-y-4">
                {OUR_MISSION.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-aqua" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader align="left" eyebrow="Company" title={OUR_MISSION.title} />
              <p className="mt-6 text-base font-medium leading-relaxed text-foreground">
                {OUR_MISSION.lead}
              </p>
            </div>
          </div>
        </div>
      </section>

      <DirectorsSection />

      {/* Team Hierarchy Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader eyebrow="Our Team" title="Meet Our Team" />
          <TeamTree />
        </div>
      </section>

      <section className="py-20 bg-gradient-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { v: 250, s: "+", l: "Projects", I: Sparkles },
            { v: 180, s: "M+", l: "Litres/Day", I: Leaf },
            { v: 15, s: "+", l: "Engineers", I: Users },
            { v: 98, s: "%", l: "Retention", I: Award },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-6 hover-lift">
              <s.I className="mx-auto h-7 w-7 text-aqua" />
              <div className="mt-3 font-display text-4xl font-bold text-aqua">
                <Counter to={s.v} suffix={s.s} />
              </div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
