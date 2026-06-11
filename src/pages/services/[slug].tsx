import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, FileText, CheckCircle2, ArrowRight, Award, DollarSign, Shield, Leaf, Clock, Users, Wrench } from "lucide-react";
import Head from "next/head";
import { IService } from "@/lib/models/Service";

export default function ServiceDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug || typeof slug !== 'string') return;

      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/services/slug/${slug}`);
        const data = await res.json();
        
        if (data.success) {
          setService(data.data);
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a5276]" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">{error || 'Service not found'}</p>
          <Link href="/our-services" className="mt-4 inline-block text-[#1a5276] hover:text-[#154360]">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'KHM Infra Innovations'
    }
  };

  const benefits = [
    {
      icon: Award,
      title: "Industry Expertise",
      description: "Years of experience delivering exceptional infrastructure solutions"
    },
    {
      icon: DollarSign,
      title: "Cost Efficiency",
      description: "Optimized solutions that maximize value within budget"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous quality control and compliance standards"
    },
    {
      icon: Leaf,
      title: "Sustainable Solutions",
      description: "Environmentally responsible practices and technologies"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Consultation",
      description: "Understanding your requirements and objectives"
    },
    {
      step: 2,
      title: "Planning",
      description: "Developing comprehensive strategy and design"
    },
    {
      step: 3,
      title: "Execution",
      description: "Implementation with precision and expertise"
    },
    {
      step: 4,
      title: "Maintenance",
      description: "Ongoing support and optimization"
    }
  ];

  return (
    <>
      <Head>
        <title>{service.title} | KHM Infra Innovations</title>
        <meta name="description" content={service.description} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.description} />
        {service.image && <meta property="og:image" content={service.image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service.title} />
        <meta name="twitter:description" content={service.description} />
        {service.image && <meta name="twitter:image" content={service.image} />}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Overview Section */}
      <section className="py-8 lg:py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase text-[#1a5276] mb-6">
                Service Overview
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 mb-8">
                {service.description}
              </p>

              {/* Key Features */}
              {service.points && service.points.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#1a5276] mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {service.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#25a244] mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Service Image */}
            {service.image && (
              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose This Service */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276] bg-[#1a5276]/5 rounded-full mb-4">
              Benefits
            </span>
            <h2 className="font-display text-4xl font-bold uppercase text-[#1a5276] mb-4">
              Why Choose This Service
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the advantages of working with industry experts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a5276] to-[#25a244] text-white mb-6">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[#1a5276] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a5276] bg-[#1a5276]/5 rounded-full mb-4">
              Process
            </span>
            <h2 className="font-display text-4xl font-bold uppercase text-[#1a5276] mb-4">
              Our Workflow
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A systematic approach to delivering excellence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-[#1a5276] to-[#25a244] text-white rounded-xl p-8 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full text-2xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/90 leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#25a244]">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#1a5276] to-[#154360] text-white">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <h2 className="font-display text-4xl font-bold uppercase mb-6">
            Need This Service?
          </h2>
          <p className="text-lg leading-relaxed text-white/90 mb-8 max-w-2xl mx-auto">
            Get in touch with our team to discuss how we can help you achieve your infrastructure goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#25a244] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
          >
            Contact Us
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Back to Services */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <Link
            href="/our-services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#1a5276] transition-colors hover:text-[#154360]"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to All Services
          </Link>
        </div>
      </section>
    </>
  );
}
