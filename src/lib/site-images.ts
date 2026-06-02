/** Static assets served from `public/images/` (Vite root URLs). */
const img = (file: string) => `/images/${file}`;

export const siteImages = {
  heroPlant: img("hero-plant.jpg"),
  waterRecycle: img("water-recycle.jpg"),
  engineers: img("engineers.jpg"),
  smartCity: img("smart-city.jpg"),
  etp: img("etp.jpg"),
  rainwater: img("rainwater.jpg"),
  govt: img("govt-project.jpg"),
  iot: img("iot-monitor.jpg"),
  heroSlide2: img("home-hero-slide-wtp.png"),
  heroSlide3: img("home-water-treatment-plant.png"),
  aboutPlant: img("home-about-plant-isometric.png"),
  projectBuilding: img("hero-plant.jpg"),
  worldMap: img("home-hero-water-wide.png"),
  videoThumb: img("engineers.jpg"),
  waterTreatmentA: img("home-water-treatment-hero.png"),
  waterTreatmentB: img("home-hero-water-gradient.png"),
  waterTreatmentC: img("home-hero-water-blue.png"),
  waterTreatmentD: img("home-hero-slide-wtp.png"),
  heroWaterBlue: img("home-hero-water-blue.png"),
  heroWaterWide: img("home-hero-water-wide.png"),
  heroWaterGradient: img("home-hero-water-gradient.png"),
  heroSlideWtp: img("home-hero-slide-wtp.png"),
  waterTreatmentHero: img("home-water-treatment-hero.png"),
  /** Clients page — professional team / partnership banner */
  clientsHero: img("engineers.jpg"),
  /** Gallery page — light blue decorative hero */
  galleryHero: img("home-hero-water-blue.png"),
} as const;
