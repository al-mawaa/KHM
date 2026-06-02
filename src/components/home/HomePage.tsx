import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeClients } from "@/components/home/HomeClients";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeGlobal } from "@/components/home/HomeGlobal";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProducts } from "@/components/home/HomeProducts";
import { HomeProject } from "@/components/home/HomeProject";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";

/** WTE-style long-scroll home flow for KHM Infra Innovations. */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeProject />
      <HomeProducts />
      <HomeGlobal />
      <HomeTestimonials />
      <HomeClients />
      <HomeCta />
    </>
  );
}
