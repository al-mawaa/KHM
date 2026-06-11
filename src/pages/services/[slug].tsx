import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { IService } from '@/lib/models/Service';
import { siteImages } from '@/lib/site-images';

export default function ServiceDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || Array.isArray(slug)) return;

    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((item: IService) => item.slug === slug);
          if (!found) {
            setError('Service not found');
            setService(null);
          } else {
            setService(found);
          }
        } else {
          setError('Unable to load service details');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  const heroDescription = service?.description
    ? service.description.slice(0, 160) + (service.description.length > 160 ? '...' : '')
    : 'Detailed service description and capabilities.';

  return (
    <>
      <PageHero
        eyebrow="SERVICE DETAILS"
        title={service?.title ?? 'Service Details'}
        description={heroDescription}
        image={service?.image || siteImages.heroPlant}
      />

      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10">
            <Link
              href="/our-services"
              className="inline-flex items-center gap-2 text-[#1a5276] font-semibold hover:text-[#154360] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1a5276]" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : service ? (
            <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {service.image && (
                <div className="h-72 overflow-hidden">
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-10 lg:p-14">
                <div className="mb-6 inline-flex items-center rounded-full bg-[#1a5276]/10 px-4 py-2 text-sm font-semibold text-[#1a5276]">
                  {service.category}
                </div>
                <h2 className="text-4xl font-bold text-[#1a5276] mb-6">{service.title}</h2>
                <p className="text-lg leading-relaxed text-slate-700 mb-8 whitespace-pre-line">
                  {service.description}
                </p>
                {service.points && service.points.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-[#1a5276] mb-4">What this service includes</h3>
                    <ul className="grid gap-4 sm:grid-cols-2">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-[#25a244]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ) : null}
        </div>
      </main>
    </>
  );
}
