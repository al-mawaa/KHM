import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { ChevronRight, X } from "lucide-react";



import { GALLERY_CTA, GALLERY_HERO } from "@/lib/gallery-content";

import { GALLERY_SECTIONS, parseGalleryHash, type GallerySectionId } from "@/lib/gallery-sections";

import { cn } from "@/lib/utils";



interface GalleryItem {

  _id: string;

  title: string;

  category: string;

  image: string;

  albumName: string;

  description: string;

}



export default function GalleryPage() {

  const [lightbox, setLightbox] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<GallerySectionId>("infrastructure");

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  const fetchGallery = async () => {

    try {

      console.log('Fetching gallery items from API...');

      setLoading(true);

      setError(null);

      const res = await fetch('/api/gallery');

      const data = await res.json();

      console.log('Frontend Gallery:', data);

      

      if (Array.isArray(data)) {

        setGalleryItems(data);

      } else {

        setError('Failed to fetch gallery items: Invalid response format');

      }

    } catch (err) {

      console.error('Error fetching gallery items:', err);

      setError('Failed to fetch gallery items');

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchGallery();

  }, []);



  useEffect(() => {

    const syncFromHash = () => {

      const parsed = parseGalleryHash(window.location.hash);

      if (parsed) setActiveSection(parsed);

    };

    syncFromHash();

    window.addEventListener("hashchange", syncFromHash);

    return () => window.removeEventListener("hashchange", syncFromHash);

  }, []);



  const setSection = (id: GallerySectionId) => {

    setActiveSection(id);

    window.history.replaceState(null, "", `/gallery#${id}`);

  };



  const items = galleryItems.filter((item) => {
    const itemCategory = item.category.toLowerCase();
    const matches = itemCategory === activeSection;
    console.log(`Filtering item: ${item.title}, category: ${item.category}, matches: ${matches}`);
    return matches;
  });



  return (

    <main className="bg-white text-gray-800">

      {/* Hero */}

      <section className="gallery-page-hero" aria-label="Gallery">

        <div className="gallery-page-hero__inner mx-auto grid max-w-[1400px] items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12 lg:px-6">

          <div className="max-w-xl py-8 lg:py-12">

            <p className="font-display text-2xl font-semibold text-gray-700 sm:text-3xl">{GALLERY_HERO.titleLine1}</p>

            <h1 className="mt-1 font-display text-3xl font-bold text-[#1a5276] sm:text-4xl lg:text-5xl">

              {GALLERY_HERO.titleLine2}

            </h1>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">

              {GALLERY_HERO.subtitle}

            </p>

          </div>

          <div className="gallery-page-hero__visual flex justify-center lg:justify-end">

            <img

              src={GALLERY_HERO.image}

              alt=""

              className="gallery-page-hero__img max-h-full w-full max-w-[520px] object-contain object-center"

              loading="eager"

            />

          </div>

        </div>

      </section>



      {/* Breadcrumb */}

      <div className="border-b border-gray-200 bg-[#f4f6f8]">

        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">

          <Link to="/" className="transition-colors hover:text-[#1a5276]">

            Home

          </Link>

          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />

          <span className="text-[#1a5276]">Gallery</span>

        </div>

      </div>



      {/* Gallery */}

      <section className="py-12 lg:py-16">

        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">

          <h2 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">Gallery</h2>



          {/* Tabs */}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {GALLERY_SECTIONS.map((section) => (

              <button

                key={section.id}

                type="button"

                onClick={() => setSection(section.id)}

                className={cn(

                  "rounded border px-6 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors",

                  activeSection === section.id

                    ? "border-[#1a5276] bg-[#1a5276] text-white"

                    : "border-gray-300 bg-white text-gray-700 hover:border-[#1a5276]/40 hover:text-[#1a5276]",

                )}

              >

                {section.label}

              </button>

            ))}

          </div>



          {/* Image grid */}

          {loading ? (

            <div className="text-center py-12 text-slate-500">Loading gallery...</div>

          ) : error ? (

            <div className="text-center py-12 text-red-600">{error}</div>

          ) : items.length === 0 ? (

            <div className="text-center py-12 text-slate-500">No gallery images found for this category</div>

          ) : (

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {items.map((item) => (

                <article

                  key={item._id}

                  className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"

                >

                  <button

                    type="button"

                    onClick={() => setLightbox(item.image)}

                    className="block w-full overflow-hidden"

                  >

                    <img

                      src={item.image}

                      alt={item.title}

                      loading="lazy"

                      className="gallery-card-img w-full object-cover transition-transform duration-300 hover:scale-[1.02]"

                    />

                  </button>

                  <p className="py-3 text-center text-sm font-semibold text-[#1a5276]">{item.title}</p>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>



      {/* CTA */}

      <section className="bg-[#1a5276] py-12 text-center text-white lg:py-14">

        <div className="mx-auto max-w-[900px] px-4 lg:px-6">

          <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">{GALLERY_CTA.title}</h2>

          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">{GALLERY_CTA.body}</p>

          <Link

            to="/contact"

            className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"

          >

            {GALLERY_CTA.button}

          </Link>

        </div>

      </section>



      {/* Lightbox */}

      {lightbox && (

        <div

          onClick={() => setLightbox(null)}

          className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black/85 p-4"

          role="dialog"

          aria-modal

        >

          <button

            type="button"

            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"

            aria-label="Close"

            onClick={() => setLightbox(null)}

          >

            <X className="h-5 w-5" />

          </button>

          <img src={lightbox} alt="" className="max-h-[88vh] max-w-[92vw] rounded-lg shadow-2xl" />

        </div>

      )}

    </main>

  );

}

