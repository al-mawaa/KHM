import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { IService } from '@/lib/models/Service';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  service: IService;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const featureCount = service.points?.length || 0;
  const truncatedDescription = service.description
    ? service.description.length > 120
      ? service.description.substring(0, 120) + '...'
      : service.description
    : '';

  return (
    <Link href={`/services/${service.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group relative h-full rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Service Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title || service.category || 'Service'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1a5276]/10 to-[#25a244]/10">
              <ImageIcon className="h-16 w-16 text-[#1a5276]/30" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a5276]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-[22px] font-bold text-[#1a5276] mb-3 leading-tight group-hover:text-[#25a244] transition-colors">
            {service.title || 'Service'}
          </h3>
          
          <p className="text-[15px] leading-7 text-slate-600 mb-4 line-clamp-3">
            {truncatedDescription || 'View service details'}
          </p>

          {/* Feature Count Badge */}
          {featureCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1a5276]/5 px-3 py-1 text-xs font-semibold text-[#1a5276] mb-4">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{featureCount} Key Feature{featureCount !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* View Details Button */}
          <div className="flex items-center gap-2 text-sm font-semibold text-[#25a244] group-hover:gap-3 transition-all">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a5276] to-[#25a244] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </motion.div>
    </Link>
  );
}
