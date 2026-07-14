import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Loader2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Grid3X3,
  Calendar,
  FolderOpen,
  ArrowRight,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

// Analytics tracking hooks (architecture for future analytics implementation)
const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  // TODO: Integrate with Google Analytics, Mixpanel, or other analytics
  console.log("[Analytics]", eventName, eventData);
};

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaAndResourcesPage() {
  useVisitorTracking("Media & Resources");
  const { settings } = useWebsiteSettings();

  const linkedin = settings.linkedin || "https://www.linkedin.com";
  const instagram = settings.instagram || "https://www.instagram.com";
  const youtube = settings.youtube || "";

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const imageRefs = useRef<Record<string, HTMLImageElement>>({});

  const fetchGallery = async () => {
    try {
      console.log("Fetching gallery items from API...");
      setLoading(true);
      setError(null);
      const res = await fetch("/api/gallery");
      const data = await res.json();
      console.log("API response:", data);

      if (data.success) {
        const sortedItems = data.data.sort(
          (a: GalleryItem, b: GalleryItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setGalleryItems(sortedItems);
      } else {
        setError(data.message || "Failed to fetch gallery items");
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError("Failed to load gallery. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Calculate statistics
  const stats = {
    totalImages: galleryItems.length,
    latestUpload:
      galleryItems.length > 0
        ? new Date(galleryItems[0].createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A",
    totalProjects: galleryItems.filter(
      (item) => item.category === "Projects" || item.title.toLowerCase().includes("project"),
    ).length,
  };

  // Extract unique categories from items with backward compatibility
  const categoryNames = Array.from(
    new Set(galleryItems.map((item) => item.category || "General").filter(Boolean))
  ).sort();

  // Filter gallery items based on selected category with backward compatibility
  const filteredItems = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => (item.category || "General") === selectedCategory);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory]);

  const handleImageLoad = (id: string, height: number) => {
    setImageHeights((prev) => ({ ...prev, [id]: height }));
  };

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setSelectedIndex(index);
    setZoom(1);
    setIsFullscreen(false);
    trackEvent("gallery_image_opened", { imageId: item._id, title: item.title });
  };

  const handlePrevious = useCallback(() => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedImage(filteredItems[newIndex]);
      setZoom(1);
      trackEvent("gallery_image_navigate", {
        direction: "previous",
        imageId: filteredItems[newIndex]._id,
      });
    }
  }, [selectedIndex, filteredItems]);

  const handleNext = useCallback(() => {
    if (selectedIndex < filteredItems.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedImage(filteredItems[newIndex]);
      setZoom(1);
      trackEvent("gallery_image_navigate", {
        direction: "next",
        imageId: filteredItems[newIndex]._id,
      });
    }
  }, [selectedIndex, filteredItems]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement("a");
      link.href = selectedImage.imageUrl;
      link.download = selectedImage.title;
      link.click();
      trackEvent("gallery_image_downloaded", {
        imageId: selectedImage._id,
        title: selectedImage.title,
      });
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    trackEvent("gallery_fullscreen_toggled", { isFullscreen: !isFullscreen });
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setZoom(1);
        setIsFullscreen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
      }
    },
    [handlePrevious, handleNext],
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
    trackEvent("gallery_load_more", { currentCount: visibleCount, newCount: visibleCount + 12 });
  };

  // Update document title for SEO
  useEffect(() => {
    document.title = "Media & Resources - KHM Infra Innovations | Water & Wastewater Treatment Projects";

    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore our latest projects, gallery, company updates, social presence, and media resources that showcase our commitment to innovation, sustainability, and engineering excellence.",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Explore our latest projects, gallery, company updates, social presence, and media resources that showcase our commitment to innovation, sustainability, and engineering excellence.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <>
      <PageHero
        title="Media & Resources"
        subtitle="Explore our latest projects, gallery, company updates, social presence, and media resources that showcase our commitment to innovation, sustainability, and engineering excellence."
        breadcrumb="Media & Resources"
        backgroundImage="/images/hero-plant.jpg"
      />

      {/* Gallery Section */}
      <section id="gallery">
        {/* Category Filter Section */}
        <section className="py-8 bg-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === "All"
                      ? "bg-[#1a5276] text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categoryNames.slice(0, 5).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === category
                        ? "bg-[#1a5276] text-white"
                        : "bg-gray-100 text-black hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 lg:ml-auto lg:shrink-0">
                <label htmlFor="gallery-category-filter" className="text-sm font-semibold text-black whitespace-nowrap">
                  Filter by Category
                </label>
                <div className="relative w-full sm:w-56">
                  <select
                    id="gallery-category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-black shadow-sm transition-colors focus:border-[#1a5276] focus:outline-none focus:ring-2 focus:ring-[#1a5276]/20"
                  >
                    <option value="All">All Categories</option>
                    {categoryNames.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-6 py-4 text-red-700">
                  <X className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-24"
              >
                <Loader2 className="h-12 w-12 animate-spin text-[#1a5276]" />
              </motion.div>
            ) : galleryItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <ImageIcon className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-semibold text-black mb-2">
                  No Gallery Images Available
                </h3>
                <p className="text-black mb-6">
                  Check back soon for updates on our latest projects.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#1a5276] text-white px-6 py-3 rounded-lg hover:bg-[#154360] transition-colors"
                >
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Gallery Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredItems.slice(0, visibleCount).map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onClick={() => handleImageClick(item, index)}
                    >
                      <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#1a5276]/20 h-64">
                        <div className="relative h-full">
                          {/* Blur placeholder */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 blur-xl opacity-50" />
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            loading="lazy"
                            className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              handleImageLoad(item._id, target.naturalHeight);
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.classList.add(
                                  "flex",
                                  "items-center",
                                  "justify-center",
                                );
                                parent.innerHTML =
                                  '<div class="text-gray-400"><svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                              }
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full" style={{ background: 'rgba(13,61,92,0.1)', color: '#0d3d5c' }}>
                          {item.category || 'General'}
                        </span>
                        <h3 className="font-semibold text-[#1a5276] group-hover:text-[#154360] transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Load More Button */}
                {visibleCount < filteredItems.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                  >
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 bg-[#1a5276] text-white px-8 py-3 rounded-lg hover:bg-[#154360] transition-all hover:shadow-lg hover:shadow-[#1a5276]/20"
                    >
                      Load More Images ({filteredItems.length - visibleCount} remaining)
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </section>

      {/* Media Section */}
      <section id="media" className="py-16 bg-linear-to-b from-[#e8f4fb] via-[#f4fbf5] to-[#ffffff]">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#1a5276]/80 mb-3">Media</p>
            <h2 className="text-4xl font-bold text-[#1a5276] sm:text-5xl">Stay Connected with KHM</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Explore our latest news, project highlights, events, and media coverage that showcase our commitment to quality, innovation, and sustainable infrastructure.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#f2fbff] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#1a5276]/20 bg-[#1a5276]/10 text-[#1a5276] shadow-sm transition duration-300 group-hover:scale-110">
                  <Linkedin className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">LinkedIn</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">Follow our official LinkedIn page for timely company updates and published posts.</p>
              </div>
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#fff7f8] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <Instagram className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">Instagram</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">View our latest projects and company moments on Instagram.</p>
              </div>
            </a>

            {/* YouTube Card - Commented Out */}
            {/* <a
              href={youtube || "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#fff7f7] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500 text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <Youtube className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">YouTube</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{youtube ? "Subscribe to our channel for videos and updates." : "YouTube channel coming soon."}</p>
              </div>
            </a> */}

            {/* WhatsApp Card - Commented Out */}
            {/* <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-4xl border-2 border-[#1a5276]/15 bg-white p-8 text-left shadow-[0_15px_40px_rgba(26,82,118,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(26,82,118,0.16)] hover:border-[#1a5276] hover:bg-[#f1fff3] active:scale-[0.98] will-change-transform"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-linear-to-r from-[#1a5276]/15 to-[#25a244]/15 blur-2xl opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#25D366] text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-slate-900">WhatsApp</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">Join our WhatsApp channel for fast updates and direct company contact.</p>
              </div>
            </a> */}
          </div>
        </div>
      </section>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 ${isFullscreen ? "p-0" : ""}`}
            onClick={() => setSelectedImage(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative w-full ${isFullscreen ? "h-full" : "max-w-6xl max-h-[90vh]"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Controls Bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm cursor-pointer"
                    aria-label="Download image"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm cursor-pointer"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-white/10 text-white rounded-lg transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-2 hover:bg-white/10 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-2 hover:bg-white/10 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
              </div>

              {/* Previous Button */}
              {selectedIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-[#f5c518] transition-colors bg-black/30 hover:bg-black/50 rounded-full p-3 backdrop-blur-sm cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}

              {/* Next Button */}
              {selectedIndex < filteredItems.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-[#f5c518] transition-colors bg-black/30 hover:bg-black/50 rounded-full p-3 backdrop-blur-sm cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </button>
              )}

              {/* Image Container */}
              <div
                className={`relative flex items-center justify-center ${isFullscreen ? "h-full" : "max-h-[80vh]"}`}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className={`max-w-full object-contain ${isFullscreen ? "max-h-screen" : "max-h-[80vh]"} mx-auto`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
