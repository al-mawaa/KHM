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

function DirectorMessageCard({ image, name, qualification, role, message }: {
  image: string;
  name: string;
  qualification: string;
  role: string;
  message: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-adjust text size based on message length
  const messageLength = message.length;
  const textSize = messageLength > 300 ? 'text-[16px]' : 'text-[18px]';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="relative rounded-[24px] bg-white border border-[#E5E7EB] shadow-[0_8px_30px_rgba(11,95,165,0.08)] overflow-hidden transition-all duration-[0.4s] hover:shadow-[0_16px_50px_rgba(11,95,165,0.15)] hover:border-[#0B5FA5]/30"
    >
      {/* Subtle quote icon behind content */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 text-[#2BA84A] opacity-[0.06] pointer-events-none z-0">
        <Quote size={180} />
      </div>

      <div className="flex flex-col h-full">
        {/* Image Section - Top */}
        <div className="relative w-full h-[250px] sm:h-[300px]">
          {/* Blue-green gradient border around image */}
          <div className="absolute inset-3 rounded-[20px] bg-gradient-to-br from-[#0B5FA5]/5 to-[#2BA84A]/5" />

          {/* Image container with proper aspect ratio */}
          <div className="relative h-full w-full p-3">
            <div className="relative h-full w-full rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <motion.img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-top"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Content Section - Bottom */}
        <div className="relative w-full p-5 sm:p-6 flex flex-col justify-center z-10">
          {/* Name */}
          <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#0B5FA5] leading-tight mb-2">
            {name}
          </h3>

          {/* Designation */}
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium text-[#4B5563] mb-3">
            {role}
          </p>

          {/* Qualifications */}
          <p className="text-[14px] sm:text-[16px] text-[#6B7280] mb-4 leading-relaxed">
            {qualification}
          </p>

          {/* Message */}
          <p className={`${textSize} leading-[1.7] text-[#4B5563] text-[14px] sm:text-[16px] lg:text-[18px]`}>
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MentorMessageCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="relative rounded-[24px] bg-white border border-[#E5E7EB] shadow-[0_8px_30px_rgba(11,95,165,0.08)] overflow-hidden transition-all duration-[0.4s] hover:shadow-[0_16px_50px_rgba(11,95,165,0.15)] hover:border-[#0B5FA5]/30"
    >
      {/* Subtle quote icon behind content */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 text-[#2BA84A] opacity-[0.06] pointer-events-none z-0">
        <Quote size={180} />
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section - Left */}
        <div className="relative w-full lg:w-2/5 xl:w-1/3 p-4 sm:p-6 flex items-center justify-center">
          {/* Blue-green gradient border around image */}
          <div className="absolute inset-3 rounded-[20px] bg-gradient-to-br from-[#0B5FA5]/5 to-[#2BA84A]/5" />

          {/* Image container with square aspect ratio */}
          <div className="relative w-full max-w-[300px] sm:max-w-full pb-[100%] lg:pb-0 lg:h-full rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <motion.img
              src="/images/mentor.png"
              alt="Mr. Madhav Kaluskar"
              className="absolute inset-0 w-full h-full object-cover object-top rounded-[20px]"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Content Section - Right */}
        <div className="relative w-full lg:w-3/5 xl:w-2/3 p-5 sm:p-6 flex flex-col justify-center z-10">
          {/* Main Quote */}
          <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold text-[#0d3d5c] leading-tight mb-3">
            "If We Cannot Save the Environment,<br />               the Environment Will Not Save Us."
          </h3>

          {/* Body Messages */}
          <div className="space-y-3 text-[14px] sm:text-[15px] leading-[1.7] text-[#4B5563]">
            <p>
              This powerful vision, embraced by M/s. KHM INFRA Innovations Pvt. Ltd. is both timely and deeply meaningful. In an era of mounting environmental challenges, it is truly heartening to witness a team of seasoned professionals and energetic young engineers unite with a shared purpose—to deliver sustainable solutions in water supply, wastewater management, solid waste management, river rejuvenation, and environmental monitoring.
            </p>
            <p>
              What stands out is the company's commitment to blending sound engineering principles with modern technologies like automation, digital systems, data analytics, and Artificial Intelligence (AI). This progressive approach not only addresses today's environmental needs but also anticipates tomorrow's, offering efficient, economical, and responsible solutions for society.
            </p>
            <p>
              As a mentor and well-wisher, I am genuinely pleased to see such dedication to environmental sustainability. My sincere hope is that KHM INFRA Innovations Pvt. Ltd. continues to uphold the highest standards of technical excellence, integrity, and innovation, steadily emerging as a trusted partner in sustainable infrastructure and environmental protection.
            </p>
            <p>
              My best wishes and blessings are with the entire KHM team. May their efforts help create a cleaner, healthier, and more sustainable future for generations to come.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
            <h4 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#0B5FA5] leading-tight mb-2">
              Mr. Madhav Kaluskar
            </h4>
            <p className="text-[14px] sm:text-[16px] text-[#6B7280]">
              Senior Board Member
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

      {/* Logo Representation Section */}
      <section id="logo-representation" className="scroll-mt-32 py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[#0D3D5C] mb-4 break-words">
              Logo Representation
            </h2>
            <div className="mx-auto h-1 w-20 sm:w-24 bg-gradient-to-r from-[#0D3D5C] to-[#22C55E] mb-8" />
            <div className="flex justify-center overflow-hidden">
              <img
                src="/images/Logo.png"
                alt="KHM Infra Logo Representation"
                className="max-w-full h-auto w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Life at KHM Infra Section */}
      <section 
        id="life-at-khm" 
        className="scroll-mt-32 py-20 lg:py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f8fbfd 0%, #f2f7fb 50%, #ffffff 100%)'
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(#0d3d5c 1px, transparent 1px),
              linear-gradient(90deg, #0d3d5c 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Soft blue blurred circles */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#0B5FA5]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#2BA84A]/4 rounded-full blur-3xl pointer-events-none" />
        
        {/* Watermark gear icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0d3d5c] opacity-[0.03] pointer-events-none z-0">
          <svg width={400} height={400} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.9838 17.0737 20.1379 17.3042 20.2434 17.5583C20.3489 17.8124 20.4035 18.0854 20.4035 18.361C20.4035 18.6366 20.3489 18.9096 20.2434 19.1637C20.1379 19.4178 19.9838 19.6483 19.79 19.842C19.5963 20.0358 19.3658 20.1899 19.1117 20.2954C18.8576 20.4009 18.5846 20.4555 18.309 20.4555C18.0334 20.4555 17.7604 20.4009 17.5063 20.2954C17.2522 20.1899 17.0217 20.0358 16.828 19.842L16.77 19.78C16.5344 19.5496 16.2351 19.3949 15.9106 19.3361C15.5862 19.2772 15.2516 19.317 14.95 19.45C14.6422 19.5767 14.3769 19.7926 14.1865 20.072C13.9961 20.3514 13.8889 20.6823 13.877 21.023V21.18C13.877 21.7426 13.6536 22.2822 13.2564 22.6794C12.8592 23.0766 12.3196 23.3 11.757 23.3C11.1944 23.3 10.6548 23.0766 10.2576 22.6794C9.86043 22.2822 9.637 21.7426 9.637 21.18V21.09C9.61859 20.7416 9.50453 20.4151 9.30953 20.1418C9.11453 19.8685 8.84693 19.6605 8.537 19.543C8.23537 19.41 7.90081 19.3702 7.57635 19.4291C7.25189 19.4879 6.95263 19.6426 6.717 19.873L6.657 19.933C6.46325 20.1268 6.23276 20.2809 5.97866 20.3864C5.72456 20.4919 5.45154 20.5465 5.17595 20.5465C4.90036 20.5465 4.62734 20.4919 4.37324 20.3864C4.11914 20.2809 3.88865 20.1268 3.69495 19.933C3.50118 19.7393 3.34709 19.5088 3.24159 19.2547C3.13609 19.0006 3.0815 18.7276 3.0815 18.452C3.0815 18.1764 3.13609 17.9034 3.24159 17.6493C3.34709 17.3952 3.50118 17.1647 3.69495 16.971L3.75495 16.911C3.98543 16.6754 4.14009 16.3761 4.19893 16.0516C4.25777 15.7272 4.21799 15.3926 4.08495 15.091C3.95828 14.7832 3.74238 14.5179 3.46298 14.3275C3.18358 14.1371 2.85268 14.0299 2.51195 14.018H2.35495C1.79239 14.018 1.25279 13.7946 0.855584 13.3974C0.458376 13.0002 0.23495 12.4606 0.23495 11.898C0.23495 11.3354 0.458376 10.7958 0.855584 10.3986C1.25279 10.0014 1.79239 9.778 2.35495 9.778H2.44495C2.78337 9.75959 3.10987 9.64553 3.38317 9.45053C3.65647 9.25553 3.86453 8.98793 3.982 8.678C4.11499 8.37637 4.15477 8.04181 4.09593 7.71735C4.03709 7.39289 3.88243 7.09363 3.652 6.858L3.592 6.798C3.39823 6.60425 3.24414 6.37376 3.13864 6.11966C3.03314 5.86556 2.97855 5.59254 2.97855 5.31695C2.97855 5.04136 3.03314 4.76834 3.13864 4.51424C3.24414 4.26014 3.39823 4.02965 3.592 3.83595C3.78575 3.64218 4.01624 3.48809 4.27034 3.38259C4.52444 3.27709 4.79746 3.2225 5.07305 3.2225C5.34864 3.2225 5.62166 3.27709 5.87576 3.38259C6.12986 3.48809 6.36035 3.64218 6.55405 3.83595L6.61405 3.89595C6.84963 4.12643 7.14889 4.28109 7.47335 4.33993C7.79781 4.39877 8.13237 4.35899 8.434 4.22595H8.537C8.84478 4.09928 9.11008 3.88338 9.30048 3.60398C9.49088 3.32458 9.59809 2.99368 9.61 2.65295V2.49595C9.61 1.93339 9.83343 1.39379 10.2306 0.996584C10.6278 0.599376 11.1674 0.37595 11.73 0.37595C12.2926 0.37595 12.8322 0.599376 13.2294 0.996584C13.6266 1.39379 13.85 1.93339 13.85 2.49595V2.58595C13.8619 2.92668 13.9691 3.25758 14.1595 3.53698C14.3499 3.81638 14.6152 4.03228 14.923 4.15895C15.2246 4.29199 15.5592 4.33177 15.8836 4.27293C16.2081 4.21409 16.5074 4.05943 16.743 3.82895L16.803 3.76895C16.9968 3.57518 17.2272 3.42109 17.4813 3.31559C17.7354 3.21009 18.0085 3.1555 18.284 3.535C18.5596 3.1555 18.8326 3.21009 19.0867 3.31559C19.3408 3.42109 19.5713 3.57518 19.765 3.76895C19.9588 3.9627 20.1129 4.19319 20.2184 4.44729C20.3239 4.70139 20.3785 4.97441 20.3785 5.25C20.3785 5.52559 20.3239 5.79861 20.2184 6.05271C20.1129 6.30681 19.9588 6.5373 19.765 6.73105L19.705 6.79105C19.4745 7.02663 19.3199 7.32589 19.261 7.65035C19.2022 7.97481 19.242 8.30937 19.375 8.611V8.714C19.5017 9.02178 19.7176 9.28708 19.997 9.47748C20.2764 9.66788 20.6073 9.77509 20.948 9.787H21.105C21.6676 9.787 22.2072 10.0104 22.6044 10.4076C23.0016 10.8048 23.225 11.3444 23.225 11.907C23.225 12.4696 23.0016 13.0092 22.6044 13.4064C22.2072 13.8036 21.6676 14.027 21.105 14.027H21.015C20.6743 14.0389 20.3434 14.1461 20.064 14.3365C19.7846 14.5269 19.5687 14.7922 19.442 15.1C19.309 15.4016 19.2692 15.7362 19.328 16.0606C19.3869 16.3851 19.5415 16.6844 19.772 16.92L19.83 16.98C20.0238 17.1737 20.1779 17.4042 20.2834 17.6583C20.3889 17.9124 20.4435 18.1854 20.4435 18.461C20.4435 18.7366 20.3889 19.0096 20.2834 19.2637C20.1779 19.5178 20.0238 19.7483 19.83 19.942C19.6363 20.1358 19.4058 20.2899 19.1517 20.3954C18.8976 20.5009 18.6246 20.5555 18.349 20.5555C18.0734 20.5555 17.8004 20.5009 17.5463 20.3954C17.2922 20.2899 17.0617 20.1358 16.868 19.942L16.808 19.882C16.5724 19.6516 16.2731 19.4969 15.9486 19.4381C15.6242 19.3792 15.2896 19.419 14.988 19.552C14.6802 19.6787 14.4149 19.8946 14.2245 20.174C14.0341 20.4534 13.9269 20.7843 13.915 21.125V21.282C13.915 21.8446 13.6916 22.3842 13.2944 22.7814C12.8972 23.1786 12.3576 23.402 11.795 23.402C11.2324 23.402 10.6928 23.1786 10.2956 22.7814C9.89843 22.3842 9.675 21.8446 9.675 21.282V21.192C9.66309 20.8513 9.55588 20.5204 9.36548 20.241C9.17508 19.9616 8.90978 19.7457 8.602 19.619C8.30037 19.486 7.96581 19.4462 7.64135 19.5051C7.31689 19.5639 7.01763 19.7186 6.782 19.949L6.722 20.009C6.52825 20.2028 6.29776 20.3569 6.04366 20.4624C5.78956 20.5679 5.51654 20.6225 5.24095 20.6225C4.96536 20.6225 4.69234 20.5679 4.43824 20.4624C4.18414 20.3569 3.95365 20.2028 3.75995 20.009C3.56618 19.8153 3.41209 19.5848 3.30659 19.3307C3.20109 19.0766 3.1465 18.8036 3.1465 18.528C3.1465 18.2524 3.20109 17.9794 3.30659 17.7253C3.41209 17.4712 3.56618 17.2407 3.75995 17.047L3.81995 16.987C4.05043 16.7514 4.20509 16.4521 4.26393 16.1276C4.32277 15.8032 4.28299 15.4686 4.14995 15.167C4.02328 14.8592 3.80738 14.5939 3.52798 14.4035C3.24858 14.2131 2.91768 14.1059 2.57695 14.094H2.41995C1.85739 14.094 1.31779 13.8706 0.920584 13.4734C0.523376 13.0762 0.29995 12.5366 0.29995 11.974C0.29995 11.4114 0.523376 10.8718 0.920584 10.4746C1.31779 10.0774 1.85739 9.854 2.41995 9.854H2.50995C2.85068 9.84209 3.18158 9.73488 3.46098 9.54448C3.74038 9.35408 3.95628 9.08878 4.08295 8.781C4.21599 8.47937 4.25577 8.14481 4.19693 7.82035C4.13809 7.49589 3.98343 7.19663 3.75295 6.961L3.69295 6.901C3.49918 6.70725 3.34509 6.47676 3.23959 6.22266C3.13409 5.96856 3.0795 5.69554 3.0795 5.41995C3.0795 5.14436 3.13409 4.87134 3.23959 4.61724C3.34509 4.36314 3.49918 4.13265 3.69295 3.93895C3.8867 3.74518 4.11719 3.59109 4.37129 3.48559C4.62539 3.38009 4.89841 3.3255 5.174 3.3255C5.44959 3.3255 5.72261 3.38009 5.97671 3.48559C6.23081 3.59109 6.4613 3.74518 6.65505 3.93895L6.71505 3.99895C6.95063 4.22943 7.24989 4.38409 7.57435 4.44293C7.89881 4.50177 8.23337 4.46199 8.535 4.32895H8.638C8.94578 4.20228 9.21108 3.98638 9.40148 3.70698C9.59188 3.42758 9.69909 3.09668 9.711 2.75595V2.59895C9.711 2.03639 9.93443 1.49679 10.3316 1.09958C10.7288 0.702376 11.2684 0.47895 11.831 0.47895C12.3936 0.47895 12.9332 0.702376 13.3304 1.09958C13.7276 1.49679 13.951 2.03639 13.951 2.59895V2.68895C13.9629 3.02968 14.0701 3.36058 14.2605 3.63998C14.4509 3.91938 14.7162 4.13528 15.024 4.26195C15.3256 4.39499 15.6602 4.43477 15.9846 4.37593C16.3091 4.31709 16.6084 4.16243 16.844 3.93195L16.904 3.87195C17.0978 3.67818 17.3282 3.52409 17.5823 3.41859C17.8364 3.31309 18.1095 3.2585 18.385 3.2585C18.6606 3.2585 18.9336 3.31309 19.1877 3.41859C19.4418 3.52409 19.6723 3.67818 19.866 3.87195C20.0598 4.0657 20.2139 4.29619 20.3194 4.55029C20.4249 4.80439 20.4795 5.07741 20.4795 5.353C20.4795 5.62859 20.4249 5.90161 20.3194 6.15571C20.2139 6.40981 20.0598 6.6403 19.866 6.83405L19.806 6.89405C19.5755 7.12963 19.4209 7.42889 19.362 7.75335C19.3032 8.07781 19.343 8.41237 19.476 8.714V8.817C19.6027 9.12478 19.8186 9.39008 20.098 9.58048C20.3774 9.77088 20.7083 9.87809 21.049 9.89H21.206C21.7686 9.89 22.3082 10.1134 22.7054 10.5106C23.1026 10.9078 23.326 11.4474 23.326 12.01C23.326 12.5726 23.1026 13.1122 22.7054 13.5094C22.3082 13.9066 21.7686 14.13 21.206 14.13H21.116C20.7753 14.1419 20.4444 14.2491 20.165 14.4395C19.8856 14.6299 19.6697 14.8952 19.543 15.203C19.41 15.5046 19.3702 15.8392 19.429 16.1636C19.4879 16.4881 19.6425 16.7874 19.873 17.023L19.931 17.081C20.1248 17.2747 20.2789 17.5052 20.3844 17.7593C20.4899 18.0134 20.5445 18.2864 20.5445 18.562C20.5445 18.8376 20.4899 19.1106 20.3844 19.3647C20.2789 19.6188 20.1248 19.8493 19.931 20.043C19.7373 20.2368 19.5068 20.3909 19.2527 20.4964C18.9986 20.6019 18.7256 20.6565 18.45 20.6565C18.1744 20.6565 17.9014 20.6019 17.6473 20.4964C17.3932 20.3909 17.1627 20.2368 16.969 20.043L16.909 19.983C16.6734 19.7526 16.3741 19.5979 16.0496 19.5391C15.7252 19.4802 15.3906 19.52 15.089 19.653C14.7812 19.7797 14.5159 19.9956 14.3255 20.275C14.1351 20.5544 14.0279 20.8853 14.016 21.226V21.383C14.016 21.9456 13.7926 22.4852 13.3954 22.8824C12.9982 23.2796 12.4586 23.503 11.896 23.503C11.3334 23.503 10.7938 23.2796 10.3966 22.8824C9.99943 22.4852 9.776 21.9456 9.776 21.383V21.293C9.76409 20.9523 9.65688 20.6214 9.46648 20.342C9.27608 20.0626 9.01078 19.8467 8.703 19.72C8.40137 19.587 8.06681 19.5472 7.74235 19.6061C7.41789 19.6649 7.11863 19.8196 6.883 20.05L6.823 20.11C6.62925 20.3038 6.39876 20.4579 6.14466 20.5634C5.89056 20.6689 5.61754 20.7235 5.34195 20.7235C5.06636 20.7235 4.79334 20.6689 4.53924 20.5634C4.28514 20.4579 4.05465 20.3038 3.86095 20.11C3.66718 19.9163 3.51309 19.6858 3.40759 19.4317C3.30209 19.1776 3.2475 18.9046 3.2475 18.629C3.2475 18.3534 3.30209 18.0804 3.40759 17.8263C3.51309 17.5722 3.66718 17.3417 3.86095 17.148L3.92095 17.088C4.15143 16.8524 4.30609 16.5531 4.36493 16.2286C4.42377 15.9042 4.38399 15.5696 4.25095 15.268C4.12428 14.9602 3.90838 14.6949 3.62898 14.5045C3.34858 14.3141 3.01768 14.2069 2.67695 14.195H2.51995C1.95739 14.195 1.41779 13.9716 1.02058 13.5744C0.623376 13.1772 0.39995 12.6376 0.39995 12.075C0.39995 11.5124 0.623376 10.9728 1.02058 10.5756C1.41779 10.1784 1.95739 9.955 2.51995 9.955H2.60995C2.95068 9.94309 3.28158 9.83588 3.56098 9.64548C3.84038 9.45508 4.05628 9.18978 4.18295 8.882C4.31599 8.58037 4.35577 8.24581 4.29693 7.92135C4.23809 7.59689 4.08343 7.29763 3.85295 7.062L3.79295 7.002C3.59918 6.80825 3.44509 6.57776 3.33959 6.32366C3.23409 6.06956 3.1795 5.79654 3.1795 5.52095C3.1795 5.24536 3.23409 4.97234 3.33959 4.71824C3.44509 4.46414 3.59918 4.23365 3.79295 4.03995C3.9867 3.84618 4.21719 3.69209 4.47129 3.58659C4.72539 3.48109 4.99841 3.4265 5.274 3.4265C5.54959 3.4265 5.82261 3.48109 6.07671 3.58659C6.33081 3.69209 6.5613 3.84618 6.75505 4.03995L6.81505 4.09995C7.05063 4.33043 7.34989 4.48509 7.67435 4.54393C7.99881 4.60277 8.33337 4.56299 8.635 4.42995H8.738C9.04578 4.30328 9.31108 4.08738 9.50148 3.80798C9.69188 3.52858 9.79909 3.19768 9.811 2.85695V2.69995C9.811 2.13739 10.0344 1.59779 10.4316 1.20058C10.8288 0.803376 11.3684 0.57995 11.931 0.57995C12.4936 0.57995 13.0332 0.803376 13.4304 1.20058C13.8276 1.59779 14.051 2.13739 14.051 2.69995V2.78995C14.0629 3.13068 14.1701 3.46158 14.3605 3.74098C14.5509 4.02038 14.8162 4.23628 15.124 4.36295C15.4256 4.49599 15.7602 4.53577 16.0846 4.47693C16.4091 4.41809 16.7084 4.26343 16.944 4.03295L17.004 3.97295C17.1978 3.77918 17.4282 3.62509 17.6823 3.51959C17.9364 3.41409 18.2095 3.3595 18.485 3.3595C18.7606 3.3595 19.0336 3.41409 19.2877 3.51959C19.5418 3.62509 19.7723 3.77918 19.966 3.97295C20.1598 4.1667 20.3139 4.39719 20.4194 4.65129C20.5249 4.90539 20.5795 5.17841 20.5795 5.454C20.5795 5.72959 20.5249 6.00261 20.4194 6.25671C20.3139 6.51081 20.1598 6.7413 19.966 6.93505L19.906 6.99505C19.6755 7.23063 19.5209 7.52989 19.462 7.85435C19.4032 8.17881 19.443 8.51337 19.576 8.815V8.918C19.7027 9.22578 19.9186 9.49108 20.198 9.68148C20.4774 9.87188 20.8083 9.97909 21.149 9.991H21.306C21.8686 9.991 22.4082 10.2144 22.8054 10.6116C23.2026 11.0088 23.426 11.5484 23.426 12.111C23.426 12.6736 23.2026 13.2132 22.8054 13.6104C22.4082 14.0076 21.8686 14.231 21.306 14.231H21.216C20.8753 14.2429 20.5444 14.3501 20.265 14.5405C19.9856 14.7309 19.7697 14.9962 19.643 15.304C19.51 15.6056 19.4702 15.9402 19.529 16.2646C19.5879 16.5891 19.7425 16.8884 19.973 17.124L20.031 17.182C20.2248 17.3757 20.3789 17.6062 20.4844 17.8603C20.5899 18.1144 20.6445 18.3874 20.6445 18.663C20.6445 18.9386 20.5899 19.2116 20.4844 19.4657C20.3789 19.7198 20.2248 19.9503 20.031 20.144C19.8373 20.3378 19.6068 20.4919 19.3527 20.5974C19.0986 20.7029 18.8256 20.7575 18.55 20.7575C18.2744 20.7575 18.0014 20.7029 17.7473 20.5974C17.4932 20.4919 17.2627 20.3378 17.069 20.144L17.009 20.084C16.7734 19.8536 16.4741 19.6989 16.1496 19.6401C15.8252 19.5812 15.4906 19.621 15.189 19.754C14.8812 19.8807 14.6159 20.0966 14.4255 20.376C14.2351 20.6554 14.1279 20.9863 14.116 21.327V21.484C14.116 22.0466 13.8926 22.5862 13.4954 22.9834C13.0982 23.3806 12.5586 23.604 11.996 23.604C11.4334 23.604 10.8938 23.3806 10.4966 22.9834C10.0994 22.5862 9.876 22.0466 9.876 21.484V21.394C9.86409 21.0533 9.75688 20.7224 9.56648 20.443C9.37608 20.1636 9.11078 19.9477 8.803 19.821C8.50137 19.688 8.16681 19.6482 7.84235 19.7071C7.51789 19.7659 7.21863 19.9206 6.983 20.151L6.923 20.211C6.72925 20.4048 6.49876 20.5589 6.24466 20.6644C5.99056 20.7699 5.71754 20.8245 5.44195 20.8245C5.16636 20.8245 4.89334 20.7699 4.63924 20.6644C4.38514 20.5589 4.15465 20.4048 3.96095 20.211C3.76718 20.0173 3.61309 19.7868 3.50759 19.5327C3.40209 19.2786 3.3475 19.0056 3.3475 18.73C3.3475 18.4544 3.40209 18.1814 3.50759 17.9273C3.61309 17.6732 3.76718 17.4427 3.96095 17.249L4.02095 17.189C4.25143 16.9534 4.40609 16.6541 4.46493 16.3296C4.52377 16.0052 4.48399 15.6706 4.35095 15.369C4.22428 15.0612 4.00838 14.7959 3.72898 14.6055C3.44858 14.4151 3.11768 14.3079 2.77695 14.296H2.61995C2.05739 14.296 1.51779 14.0726 1.12058 13.6754C0.723376 13.2782 0.49995 12.7386 0.49995 12.176C0.49995 11.6134 0.723376 11.0738 1.12058 10.6766C1.51779 10.2794 2.05739 10.056 2.61995 10.056H2.70995C3.05068 10.0441 3.38158 9.93688 3.66098 9.74648C3.94038 9.55608 4.15628 9.29078 4.28295 8.983C4.41599 8.68137 4.45577 8.34681 4.39693 8.02235C4.33809 7.69789 4.18343 7.39863 3.95295 7.163L3.89295 7.103C3.69918 6.90925 3.54509 6.67876 3.43959 6.42466C3.33409 6.17056 3.2795 5.89754 3.2795 5.62195C3.2795 5.34636 3.33409 5.07334 3.43959 4.81924C3.54509 4.56514 3.69918 4.33465 3.89295 4.14095C4.0867 3.94718 4.31719 3.79309 4.57129 3.68759C4.82539 3.58209 5.09841 3.5275 5.374 3.5275C5.64959 3.5275 5.92261 3.58209 6.17671 3.68759C6.43081 3.79309 6.6613 3.94718 6.85505 4.14095L6.91505 4.20095C7.15063 4.43143 7.44989 4.58609 7.77435 4.64493C8.09881 4.70377 8.43337 4.66399 8.735 4.53095H8.838C9.14578 4.40428 9.41108 4.18838 9.60148 3.90898C9.79188 3.62858 9.89909 3.29768 9.911 2.95695V2.79995C9.911 2.23739 10.1344 1.69779 10.5316 1.30058C10.9288 0.903376 11.4684 0.67995 12.031 0.67995C12.5936 0.67995 13.1332 0.903376 13.5304 1.30058C13.9276 1.69779 14.151 2.23739 14.151 2.79995V2.88995C14.1629 3.23068 14.2701 3.56158 14.4605 3.84098C14.6509 4.12038 14.9162 4.33628 15.224 4.46295C15.5256 4.59599 15.8602 4.63577 16.1846 4.57693C16.5091 4.51809 16.8084 4.36343 17.044 4.13295L17.104 4.07295C17.2978 3.87918 17.5282 3.72509 17.7823 3.61959C18.0364 3.51409 18.3095 3.4595 18.585 3.4595C18.8606 3.4595 19.1336 3.51409 19.3877 3.61959C19.6418 3.72509 19.8723 3.87918 20.066 4.07295C20.2598 4.2667 20.4139 4.49719 20.5194 4.75129C20.6249 5.00539 20.6795 5.27841 20.6795 5.554C20.6795 5.82959 20.6249 6.10261 20.5194 6.35671C20.4139 6.61081 20.2598 6.8413 20.066 7.03505L20.006 7.09505C19.7755 7.33063 19.6209 7.62989 19.562 7.95435C19.5032 8.27881 19.543 8.61337 19.676 8.915V9.018C19.8027 9.32578 20.0186 9.59108 20.298 9.78148C20.5774 9.97188 20.9083 10.0791 21.249 10.091H21.406C21.9686 10.091 22.5082 10.3144 22.9054 10.7116C23.3026 11.1088 23.526 11.6484 23.526 12.211C23.526 12.7736 23.3026 13.3132 22.9054 13.7104C22.5082 14.1076 21.9686 14.331 21.406 14.331H21.316C20.9753 14.3429 20.6444 14.4501 20.365 14.6405C20.0856 14.8309 19.8697 15.0962 19.743 15.404C19.61 15.7056 19.5702 16.0402 19.629 16.3646C19.6879 16.6891 19.8425 16.9884 20.073 17.224L20.131 17.282C20.3248 17.4757 20.4789 17.7062 20.5844 17.9603C20.6899 18.2144 20.7445 18.4874 20.7445 18.763C20.7445 19.0386 20.6899 19.3116 20.5844 19.5657C20.4789 19.8198 20.3248 20.0503 20.131 20.244C19.9373 20.4378 19.7068 20.5919 19.4527 20.6974C19.1986 20.8029 18.9256 20.8575 18.65 20.8575C18.3744 20.8575 18.1014 20.8029 17.8473 20.6974C17.5932 20.5919 17.3627 20.4378 17.169 20.244L17.109 20.184C16.8734 19.9536 16.5741 19.7989 16.2496 19.7401C15.9252 19.6812z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[#0D3D5C] mb-4 break-words">
              Life at KHM Infra
            </h2>
            <div className="mx-auto h-1 w-20 sm:w-24 bg-gradient-to-r from-[#0D3D5C] to-[#22C55E]" />
          </div>
          <div className="max-w-4xl mx-auto w-full">
            <div 
              className="p-6 sm:p-8 lg:p-10 space-y-6 text-[16px] sm:text-[18px] leading-[1.9] text-[#4B5563] rounded-[20px] w-full"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(13,61,92,0.08)',
                boxShadow: '0 12px 30px rgba(13,61,92,0.06)'
              }}
            >
              <p>
                At KHM Infra, we believe that a positive work culture is the foundation of a successful organization. We strive to create an environment where employees feel valued, connected, and motivated to perform at their best.
              </p>
              <p>
                Beyond delivering quality infrastructure solutions, we are committed to building a workplace that encourages collaboration, mutual respect, and a strong sense of belonging.
              </p>
              <p>
                Life at KHM Infra is filled with opportunities to connect, celebrate, and grow together. From festive celebrations, annual gatherings, and team outings to sports events, cultural programs, and employee engagement activities, we ensure that every occasion strengthens the bond among our team members. These moments create lasting memories while fostering teamwork, trust and a vibrant workplace culture.
              </p>
              <p>
                We also encourage employees to participate in social initiatives, community activities and wellness programs that promote personal well-being and a sense of social responsibility.
              </p>
              <p>
                By celebrating achievements, recognizing contributions and creating opportunities for meaningful interactions, we build a workplace where every individual feels appreciated and inspired.
              </p>
              <p>
                At KHM Infra, work is more than just meeting project milestones—it's about being part of a supportive team that celebrates success, embraces new experiences and enjoys the journey together. We believe that when people feel connected and motivated, they create exceptional results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group"
            >
              <img
                src="/images/li-1.jpg"
                alt="Employee Award Ceremony"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group"
            >
              <img
                src="/images/li-2.jpg"
                alt="Company Merchandise"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group"
            >
              <img
                src="/images/li-3.jpg"
                alt="Training Session"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group"
            >
              <img
                src="/images/li-4.jpg"
                alt="Team Meeting"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group"
            >
              <img
                src="/images/li-5.jpg"
                alt="Office Workspace"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group"
            >
              <img
                src="/images/li-6.jpg"
                alt="Team Group Photo"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group sm:col-span-2 lg:col-span-1"
            >
              <img
                src="/images/li-7.jpg"
                alt="Open Office Workspace"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="relative rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(13,61,92,0.12)] group sm:col-span-2 lg:col-span-1"
            >
              <img
                src="/images/li-8.jpg"
                alt="Team Event"
                className="w-full h-64 object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-[1.03]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="our-vision"
        className="scroll-mt-32 border-t border-border bg-[#f8fafc] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
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
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card w-full">
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

      <section id="our-mission" className="scroll-mt-32 border-t border-border bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card w-full">
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
        id="what-we-stand-for"
        className="scroll-mt-32 border-t border-border py-16 sm:py-20 lg:py-24 relative overflow-hidden"
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

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Section Header */}
          <div className="mb-12 sm:mb-16 text-center">
            <div className="mx-auto mb-4 h-1 w-20 sm:w-24 bg-gradient-to-r from-[#0d3d5c] via-[#1e88e5] to-[#6aa84f]" />
            <h2 className="mb-3 text-sm font-bold tracking-[0.2em] uppercase text-[#64748b]">
              Core Values
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-[#0d3d5c] font-display leading-tight">
              What We Stand For
            </h3>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
      <section
        id="directors-message"
        className="scroll-mt-36 py-16 sm:py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        {/* Subtle dotted pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0B5FA5 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Soft blue-green radial gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#0B5FA5]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2BA84A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0d3d5c] font-display leading-tight">
              Director's Message
            </h2>

          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-[1400px] mx-auto">
            <DirectorMessageCard
              image="/images/der-1.png"
              name="Mr. Hrishikesh Kaluskar"
              qualification="B.E. Civil, M.E. Environmental Engineering"
              role="Director, Technical"
              message="At KHM Infra Innovations Pvt. Ltd., innovation and engineering excellence drive everything we do. We continuously enhance our processes, embrace emerging technologies, and strengthen our technical capabilities to deliver smarter and more sustainable infrastructure solutions. With robust multidisciplinary controls and a client-centric approach, we are committed to providing reliable, efficient, and best-in-class services that exceed expectations and contribute to a better future."
            />
            <DirectorMessageCard
              image="/images/der-2.png"
              name="Ms. Smita Kaluskar"
              qualification="Associate Chartered Accountant"
              role="Director, Administration"
              message="Our journey is guided by a commitment to responsible growth, operational excellence, and lasting value creation. We believe that strong systems, prudent management, and a dedicated team are essential to delivering meaningful outcomes for our clients and stakeholders. As we continue to grow, we remain focused on fostering trust, efficiency, and continuous improvement in everything we do. We look forward to building enduring relationships and supporting sustainable progress."
            />
          </div>
        </div>
      </section>

      {/* Our Mentor Section */}
      <section
        id="our-mentor"
        className="scroll-mt-36 py-16 sm:py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}
      >
        {/* Subtle dotted pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #2BA84A 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Soft blue-green radial gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B5FA5]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2BA84A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 h-1 w-20 sm:w-24 bg-gradient-to-r from-[#0d3d5c] via-[#1e88e5] to-[#69B345]" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0d3d5c] font-display leading-tight">
              Our Mentor
            </h2>
            <p className="mt-3 text-base text-[#64748B]">
              Guided by wisdom. Inspired by vision. Driven by purpose.
            </p>
          </div>
          <MentorMessageCard />
        </div>
      </section>

      <DirectorsSection />

      {/* Team Hierarchy — managed in Admin → Team Hierarchy */}
      <section id="management-team" className="scroll-mt-32 py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
