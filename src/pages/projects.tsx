import { PageHero } from "@/components/PageHero";
import { heroPlant } from "@/lib/images";

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Projects" title="A portfolio engineered for impact" description="Selected projects spanning government infrastructure, industrial plants and large commercial assets." image={heroPlant} />
    </>
  );
}
