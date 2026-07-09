import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeGlobal } from "@/components/home/HomeGlobal";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProject } from "@/components/home/HomeProject";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeWhyChoose } from "@/components/home/HomeWhyChoose";

/** WTE-style long-scroll home flow for KHM Infra Innovations. */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeProject />
      <HomeGlobal />
      <HomeTestimonials />
      <HomeWhyChoose />
    </>
  );
}
