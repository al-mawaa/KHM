import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeGlobal } from "@/components/home/HomeGlobal";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProject } from "@/components/home/HomeProject";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";

/** WTE-style long-scroll home flow for KHM Infra Innovations. */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeProject />
      <HomeGlobal />
      <HomeTestimonials />
      <HomeCta />
    </>
  );
}
