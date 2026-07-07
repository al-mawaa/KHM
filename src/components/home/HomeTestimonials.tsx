import { useState, useEffect, useRef } from "react";
import { Quote, MessageCircle, X, Star, Loader2, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface TestimonialItem {
  _id: string;
  name: string;
  feedback: string;
  industryType: string;
  rating?: number;
  status: string;
  companyName?: string;
  designation?: string;
  city?: string;
  profileImage?: string;
  profileImagePublicId?: string;
  isFeatured?: boolean;
  createdAt: string;
}

const brandColors = {
  blue: "#0B5FA5",
  green: "#2BA84A",
  blueLight: "#0B5FA5",
  greenLight: "#2BA84A",
};

function TestimonialCard({ testimonial, index }: { testimonial: TestimonialItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isBlue = index % 2 === 0;
  const accentColor = isBlue ? brandColors.blue : brandColors.green;
  const accentGradient = isBlue
    ? `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.blueLight} 100%)`
    : `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.greenLight} 100%)`;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 transition-all duration-300 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const sanitizeFeedback = (feedback: string) => {
    let sanitized = feedback.replace(/https?:\/\/[^\s]+/g, '');
    sanitized = sanitized.replace(/www\.[^\s]+/g, '');
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    return sanitized;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative rounded-[18px] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E5E7EB] transition-all duration-[0.3s] ease-out hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:border-[#0B5FA5] flex flex-col min-h-[250px] max-h-[280px]"
    >
      {/* Top Section: Stars Left, Verified Badge Right */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-0.5">
          {renderStars(testimonial.rating)}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0B5FA5]/5 border border-[#0B5FA5]/20">
          <CheckCircle2 className="h-3 w-3 text-[#0B5FA5]" />
          <span className="text-[11px] font-medium text-[#0B5FA5]">Verified</span>
        </div>
      </div>

      {/* Review Text with Small Quote Icon */}
      <div className="flex-1 flex items-start gap-2 mb-4">
        <Quote className="h-4 w-4 text-[#0B5FA5] opacity-30 flex-shrink-0 mt-0.5" />
        <p className="text-[15px] leading-[1.6] text-[#4B5563] line-clamp-4 flex-1">
          {sanitizeFeedback(testimonial.feedback)}
        </p>
      </div>

      {/* Client Profile */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        {testimonial.profileImage ? (
          <img
            src={testimonial.profileImage}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[#0B5FA5]/10 transition-transform duration-[0.3s] ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-xs transition-transform duration-[0.3s] ease-out group-hover:scale-105"
            style={{ background: accentGradient }}
          >
            {getInitials(testimonial.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1F2937] text-sm truncate">{testimonial.name}</p>
          <p className="text-xs text-[#6B7280] truncate">
            {testimonial.designation || testimonial.industryType}
            {testimonial.companyName && ` · ${testimonial.companyName}`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function HomeTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    industryType: "",
    feedback: "",
    rating: 5,
    companyName: "",
    designation: "",
    city: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch with featured prioritization
      const res = await fetch("/api/testimonials?status=approved&sort=featured");
      const data = await res.json();
      
      if (data.success) {
        setTestimonials(data.data);
      } else {
        setError("Failed to load testimonials");
      }
    } catch (err) {
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (testimonials.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get visible testimonials for carousel
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return result;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!formData.industryType.trim()) {
      setFormError("Industry type is required");
      return;
    }
    if (!formData.feedback.trim()) {
      setFormError("Feedback is required");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          feedback: formData.feedback,
          industryType: formData.industryType,
          rating: formData.rating,
          companyName: formData.companyName,
          designation: formData.designation,
          city: formData.city,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Thank you for your feedback. It will appear on the website after admin review.");
        setFormData({
          name: "",
          industryType: "",
          feedback: "",
          rating: 5,
          companyName: "",
          designation: "",
          city: "",
        });
        setTimeout(() => {
          setModalOpen(false);
          setSuccessMessage(null);
        }, 3000);
      } else {
        setFormError(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      setFormError("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot pattern in corners */}
        <div
          className="absolute top-0 left-0 w-32 h-32 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${brandColors.blue} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${brandColors.green} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${brandColors.green} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${brandColors.blue} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        {/* Blurred gradient blobs */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-[100px] opacity-[0.04]"
          style={{ backgroundColor: brandColors.blue }}
        />
        <div
          className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-[100px] opacity-[0.04]"
          style={{ backgroundColor: brandColors.green }}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B5FA5]">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Trusted by industries, municipalities and organizations across India.
          </p>
          <div className="mt-4 mx-auto h-1 w-20 bg-gradient-to-r from-[#0B5FA5] to-[#2BA84A] rounded-full" />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0B5FA5]" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-[#4B5563]">Failed to load testimonials. Please try again later.</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4B5563]">No testimonials available yet.</p>
          </div>
        ) : (
          <>
            {/* Carousel Container */}
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Cards Grid */}
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {getVisibleTestimonials().map((testimonial, index) => (
                  <TestimonialCard
                    key={`${testimonial._id}-${index}`}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Navigation and Pagination */}
            {testimonials.length > 3 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={handlePrevious}
                  className="h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-[#0B5FA5] hover:text-white hover:border-[#0B5FA5] transition-all duration-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-6 bg-[#0B5FA5]"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-[#0B5FA5] hover:text-white hover:border-[#0B5FA5] transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Premium CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => setModalOpen(true)}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B5FA5] text-white rounded-[12px] font-semibold hover:bg-[#2BA84A] transition-all duration-[0.3s] ease-out shadow-[0_4px_12px_rgba(11,95,165,0.2)] hover:shadow-[0_6px-16px_rgba(43,168,74,0.3)] h-[48px]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Share Your Experience</span>
          </button>
        </motion.div>
      </div>

      {/* Feedback Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-3 sm:p-4 pt-20 sm:pt-24" onClick={() => !submitting && setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[85vh] sm:max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-white">
              <h3 className="font-display text-base sm:text-lg font-bold text-[#1a5276]">Share Your Feedback</h3>
              <button
                onClick={() => !submitting && setModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {successMessage ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-black">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formError}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                    placeholder="Your name"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-1.5">
                    Industry Type *
                  </label>
                  <input
                    type="text"
                    value={formData.industryType}
                    onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                    placeholder="e.g., Manufacturing, Healthcare, Education"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-1.5">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                    placeholder="Your company name"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-1.5">
                    Designation (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                    placeholder="e.g., CEO, Manager, Director"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-1.5">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                    placeholder="Your city"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black">
                      Feedback * (80 words max)
                    </label>
                    <span className="text-xs text-black">
                      {formData.feedback.trim().split(/\s+/).filter(w => w).length}/80
                    </span>
                  </div>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/).filter(w => w).length;
                      if (words <= 80 || e.target.value.length < formData.feedback.length) {
                        setFormData({ ...formData, feedback: e.target.value });
                      }
                    }}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none"
                    placeholder="Share your experience with KHM Infra... (max 80 words)"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-1.5">
                    Rating (Optional)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        disabled={submitting}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= formData.rating
                              ? "fill-amber-500 text-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-black font-semibold hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-[#1a5276] text-white font-semibold hover:bg-[#1a5276]/90 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
