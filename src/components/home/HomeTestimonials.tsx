import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Quote, MessageCircle, X, Star, Loader2, Upload } from "lucide-react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

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

export function HomeTestimonials() {
  const reduceMotion = useReducedMotion();
  const swiperRef = useRef<any>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    industryType: "",
    feedback: "",
    rating: 5,
    companyName: "",
    designation: "",
    city: "",
    profileImage: "",
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

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewImage(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFormError('Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.');
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setFormError('File size exceeds 2MB limit.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        return { url: data.filePath, publicId: data.publicId };
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
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
      
      let profileImagePath = formData.profileImage;
      let profileImagePublicId = "";
      
      // Upload image if selected
      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          profileImagePath = uploadResult.url;
          profileImagePublicId = uploadResult.publicId;
        } catch (error) {
          setFormError("Failed to upload image");
          setSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profileImage: profileImagePath,
          profileImagePublicId,
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
          profileImage: "",
        });
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-[#f4f6f8] py-14 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <h2 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">
            Testimonials
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a5276] text-white rounded-lg font-semibold hover:bg-[#1a5276]/90 transition-colors text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Give Feedback
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1a5276]" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load testimonials. Please try again later.</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials available yet.</p>
          </div>
        ) : (
          <div className="testimonials-swiper relative">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Autoplay]}
              navigation={!reduceMotion}
              autoplay={!reduceMotion ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 } }}
              className="!pb-2"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t._id}>
                  <article className="relative h-full rounded-lg border border-gray-200 bg-white p-8 pt-12 shadow-sm">
                    {t.isFeatured && (
                      <div className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                      </div>
                    )}
                    <Quote className="absolute left-6 top-4 h-10 w-10 text-[#b8d4e8]" fill="currentColor" />
                    <p className="relative text-sm leading-relaxed text-gray-600 italic">"{t.feedback}"</p>
                    <div className="mt-4">
                      {renderStars(t.rating)}
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                      {t.profileImage ? (
                        <img 
                          src={t.profileImage} 
                          alt={t.name}
                          className="h-12 w-12 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#1a5276] text-sm font-bold text-white">
                          {getInitials(t.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#1a5276]">{t.name}</p>
                        {t.designation && <p className="text-xs text-gray-600">{t.designation}</p>}
                        {t.companyName && <p className="text-xs text-gray-500">{t.companyName}</p>}
                        <p className="text-xs text-gray-500">{t.industryType}</p>
                        {t.city && <p className="text-xs text-gray-400">{t.city}</p>}
                      </div>
                    </div>
                    <Quote className="absolute bottom-4 right-6 h-8 w-8 rotate-180 text-gray-200" />
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => !submitting && setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sticky top-0 bg-white">
              <h3 className="font-display text-lg font-bold text-[#1a5276]">Share Your Feedback</h3>
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
                <p className="text-gray-700">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formError}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Feedback *
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none"
                    placeholder="Share your experience with KHM Infra..."
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Profile Photo (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      selectedFile || previewImage
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-300 hover:border-[#1a5276] hover:bg-gray-50'
                    }`}
                  >
                    {uploading ? (
                      <div className="space-y-2">
                        <Loader2 className="h-6 w-6 mx-auto animate-spin text-[#1a5276]" />
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </div>
                    ) : previewImage ? (
                      <div className="space-y-3">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-24 w-24 rounded-full mx-auto object-cover"
                        />
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewImage(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-[#1a5276] hover:text-[#1a5276]/80"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, JPEG, PNG, or WebP (max 2MB)
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs text-[#1a5276] hover:text-[#1a5276]/80 font-semibold"
                        >
                          Select Image
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploading}
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
