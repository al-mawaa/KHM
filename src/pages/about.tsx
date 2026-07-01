import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Counter } from "@/components/Counter";
import { ABOUT_US, OUR_VISION, OUR_MISSION } from "@/lib/about-content";
import { rainwater, heroPlant } from "@/lib/images";
import { Award, CheckCircle2, Leaf, Target, Users, Eye, Sparkles, Linkedin, Star, Recycle, Zap, Shield, Diamond, Triangle, Quote } from "lucide-react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { TeamTree } from "@/components/TeamTree";
import { useAdminCollection } from "@/lib/admin-store";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

interface CoreValueCardProps {
  icon: any;
  title: string;
  points: string[];
  accentColor: string;
  gradient: string;
  index: number;
}

function CoreValueCard({ icon: Icon, title, points, accentColor, gradient, index }: CoreValueCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative rounded-[18px] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[rgba(13,61,92,0.08)] transition-all duration-[0.35s] ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(13,61,92,0.15)] hover:border-[#0d3d5c]"
    >
      {/* Top Accent Bar */}
      <div 
        className="absolute left-0 right-0 top-0 h-1.5 rounded-t-[18px]"
        style={{ backgroundColor: accentColor }}
      />

      {/* Premium Icon Container */}
      <div 
        className="relative mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-full shadow-lg transition-transform duration-[0.35s] ease-out group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
          boxShadow: `0 8px 24px ${accentColor}40`
        }}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>

      {/* Enhanced Typography */}
      <h3 
        className="mb-4 text-[24px] font-bold text-[#0d3d5c] font-display leading-tight"
      >
        {title}
      </h3>

      <ul className="space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 text-[16px] leading-[1.8] text-[#64748b]"
          >
            <span 
              className="mt-2 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function DirectorMessageCard({ image, name, qualification, role, message, imageLeft }: {
  image: string;
  name: string;
  qualification: string;
  role: string;
  message: string;
  imageLeft: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-[24px] bg-white p-[40px] md:p-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Green quotation icon in top-right corner */}
      <div className="absolute top-8 right-8 text-[#69B345]">
        <Quote size={64} />
      </div>

      <div className={`flex flex-col md:flex-row gap-8 md:gap-12 items-center ${imageLeft ? '' : 'md:flex-row-reverse'}`}>
        {/* Director Photo */}
        <div className="w-full md:w-[38%]">
          <img
            src={image}
            alt={name}
            className="w-full h-[400px] md:h-[500px] object-cover rounded-[20px]"
          />
        </div>

        {/* Message Content */}
        <div className="w-full md:w-[62%]">
          <p className="text-[16px] leading-[1.8] text-[#64748B] mb-8">
            {message}
          </p>
          <div className="space-y-2">
            <h5 className="text-2xl font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-signature)' }}>
              {name}
            </h5>
            <p className="text-[15px] text-[#64748B]">
              {qualification}
            </p>
            <p className="text-[15px] text-[#64748B]">
              {role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DirectorsSection() {
  const [team] = useAdminCollection("team");

  const directors = team.filter((member) => member.isDirector === true);

  // Only render section if there are directors
  if (directors.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow="Leadership" title="Meet the directors" />
        <div
          className={`mt-12 grid gap-6 max-w-3xl mx-auto ${directors.length === 1 ? "sm:grid-cols-1 justify-center" : "sm:grid-cols-2"}`}
        >
          {directors.map((d) => (
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

      <section 
        id="core-values" 
        className="scroll-mt-32 border-t border-border py-20 lg:py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)'
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(#0d3d5c 1px, transparent 1px),
              linear-gradient(90deg, #0d3d5c 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          {/* Enhanced Section Header */}
          <div className="mb-16 text-center">
            <div className="mx-auto mb-4 h-1 w-24 bg-gradient-to-r from-[#0d3d5c] via-[#1e88e5] to-[#6aa84f]" />
            <h2 className="mb-3 text-sm font-bold tracking-[0.2em] uppercase text-[#64748b]">
              Core Values
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-[#0d3d5c] font-display leading-tight">
              What We Stand For
            </h3>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Star,
                title: "Quality Excellence",
                points: [
                  "Technically rigorous solutions",
                  "Precision in every deliverable",
                  "International standards compliance",
                ],
                accentColor: "#0d3d5c",
                gradient: "from-[#0d3d5c] to-[#1e88e5]",
              },
              {
                icon: Recycle,
                title: "Sustainability",
                points: [
                  "Eco-friendly infrastructure design",
                  "Long-term environmental impact",
                  "Water security focus",
                ],
                accentColor: "#6aa84f",
                gradient: "from-[#6aa84f] to-[#4a8c3a]",
              },
              {
                icon: Zap,
                title: "Innovation",
                points: [
                  "Drone surveys & GIS mapping",
                  "Hydraulic modelling tools",
                  "Advanced engineering technologies",
                ],
                accentColor: "#0d3d5c",
                gradient: "from-[#0d3d5c] to-[#1e88e5]",
              },
              {
                icon: Shield,
                title: "Integrity",
                points: [
                  "Highest ethical standards",
                  "Transparent engagements",
                  "Accountable project delivery",
                ],
                accentColor: "#6aa84f",
                gradient: "from-[#6aa84f] to-[#4a8c3a]",
              },
              {
                icon: Diamond,
                title: "Client Trust",
                points: [
                  "Long-term partnerships",
                  "Consistent delivery record",
                  "Open & honest communication",
                ],
                accentColor: "#0d3d5c",
                gradient: "from-[#0d3d5c] to-[#1e88e5]",
              },
              {
                icon: Triangle,
                title: "Technical Expertise",
                points: [
                  "Multi-sector domain depth",
                  "Experienced core team",
                  "Cross-disciplinary capability",
                ],
                accentColor: "#6aa84f",
                gradient: "from-[#6aa84f] to-[#4a8c3a]",
              },
            ].map((value, index) => (
              <CoreValueCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                points={value.points}
                accentColor={value.accentColor}
                gradient={value.gradient}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Director Message Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Director's Message
            </h2>
            
          </div>
          <div className="flex flex-col gap-8">
            <DirectorMessageCard
              image="/images/der-1.png"
              name="Mr. Hrishikesh Kaluskar"
              qualification="B.E. Civil, M.E. Environmental Engineering"
              role="Director, Technical"
              message="At KHM Infra Innovations Pvt. Ltd., innovation and engineering excellence drive everything we do. We continuously enhance our processes, embrace emerging technologies, and strengthen our technical capabilities to deliver smarter and more sustainable infrastructure solutions. With robust multidisciplinary controls and a client-centric approach, we are committed to providing reliable, efficient, and best-in-class services that exceed expectations and contribute to a better future."
              imageLeft={true}
            />
            <DirectorMessageCard
              image="/images/der-2.png"
              name="Ms. Smita Kaluskar"
              qualification="Associate Chartered Accountant"
              role="Director, Administration"
              message="Our journey is guided by a commitment to responsible growth, operational excellence, and lasting value creation. We believe that strong systems, prudent management, and a dedicated team are essential to delivering meaningful outcomes for our clients and stakeholders. As we continue to grow, we remain focused on fostering trust, efficiency, and continuous improvement in everything we do. We look forward to building enduring relationships and supporting sustainable progress."
              imageLeft={false}
            />
          </div>
        </div>
      </section>

      <DirectorsSection />

      {/* Team Hierarchy — managed in Admin → Team Hierarchy */}
      <section id="management-team" className="scroll-mt-32 py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader  title="Meet Our Management Team" />
          <p className="mx-auto mt-3 mb-6 max-w-xl text-center text-sm text-slate-600">
            Click on any member&apos;s photo or name to view their message and role details.
          </p>
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
