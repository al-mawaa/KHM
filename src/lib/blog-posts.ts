import { siteImages } from "@/lib/site-images";

export type BlogPostItem = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
};

/** Public blog listing — WTE-style “Our Blogs” content for KHM Infra Innovations. */
export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: "industrial-water-treatment-methods",
    title: "Commonly Used Industrial Water Treatment Methods",
    excerpt:
      "Industrial water must be treated to remove contaminants before reuse or safe discharge. Explore the most widely used treatment methods across manufacturing sectors.",
    image: siteImages.etp,
  },
  {
    slug: "water-treatment-plant-process-steps",
    title: "Water Treatment Plant (WTP) Process & Steps: A Comprehensive Guide",
    excerpt:
      "A complete overview of how water treatment plants remove impurities and deliver water suitable for drinking, industry, and irrigation.",
    image: siteImages.heroPlant,
  },
  {
    slug: "how-wastewater-treatment-plants-work",
    title: "How Wastewater Treatment Plants (WWTP) Work: Understanding the Process",
    excerpt:
      "Wastewater treatment plants protect the environment and public health. Learn how primary, secondary, and tertiary stages work together.",
    image: siteImages.engineers,
  },
  {
    slug: "why-water-treatment-important-industries",
    title: "Why Water Treatment Plant Is Important for Industries?",
    excerpt:
      "Industrial water is often contaminated with chemicals and solids. Treatment protects workers, equipment, and the environment while supporting compliance.",
    image: siteImages.waterRecycle,
  },
  {
    slug: "benefits-clarifier-tank-system",
    title: "The Benefits of Using a Clarifier Tank System in Water Treatment",
    excerpt:
      "Clarifier tanks play a vital role in removing suspended solids and improving water clarity before downstream filtration and disinfection.",
    image: siteImages.etp,
  },
  {
    slug: "industrial-filtration-system",
    title: "Industrial Filtration System: What They Are, and Why They Matter",
    excerpt:
      "Filtration systems are essential in food, beverage, pharmaceutical, and chemical industries to meet quality standards and protect process equipment.",
    image: siteImages.waterTreatmentB,
  },
  {
    slug: "why-water-treatment-important-clean-water",
    title: "Why Water Treatment Plant Is Important: Providing Clean and Safe Water for All",
    excerpt:
      "Access to clean water is fundamental. Treatment plants ensure safe supply for communities, industries, and agriculture through proven engineering.",
    image: siteImages.aboutPlant,
  },
  {
    slug: "choose-right-effluent-treatment-system",
    title: "How to Choose the Right Industrial Effluent Treatment System",
    excerpt:
      "Selecting an ETP depends on effluent type, flow rate, discharge norms, and recovery goals. Key factors engineers evaluate before design.",
    image: siteImages.smartCity,
  },
  {
    slug: "industrial-wastewater-challenges-solutions",
    title: "How to Find the Right Solution for the Challenge of Industrial Wastewater",
    excerpt:
      "Industrial wastewater varies by sector. Discover how to match technology — ETP, ZLD, or hybrid systems — to your plant’s specific challenges.",
    image: siteImages.heroSlide2,
  },
];
