import Link from 'next/link';
import { motion } from 'framer-motion';
import { IService } from '@/lib/models/Service';

interface ServiceCardProps {
  service: IService;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const description = service.description || '';
  const shortDesc =
    description.length > 140 ? description.slice(0, 140).trimEnd() + '...' : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[560px]"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a5276] to-[#25a244] rounded-l-xl" />

      {service.image && (
        <div className="mb-4 overflow-hidden rounded-md">
          <img src={service.image} alt={service.title} className="w-full h-56 object-cover" loading="lazy" />
        </div>
      )}

      <h3 className="text-[20px] font-bold text-[#1a5276] mb-3 pr-4 leading-tight break-words">
        {service.title}
      </h3>

      <div className="flex-1 overflow-hidden">
        <p
          className="text-[15px] leading-7 text-slate-600 mb-4 break-words whitespace-normal"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {shortDesc}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <Link
          href={`/services/${service.slug}`}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-[#1a5276] text-white rounded-md font-semibold hover:bg-[#1a5276]/90 transition-colors text-sm"
        >
          Read more
        </Link>
      </div>
    </motion.div>
  );
}
