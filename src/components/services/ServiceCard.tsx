import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { IService } from '@/lib/models/Service';

interface ServiceCardProps {
  service: IService;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a5276] to-[#25a244] rounded-l-xl" />
      <h3 className="text-[24px] font-bold text-[#1a5276] mb-6 pr-4 leading-tight">
        {service.title}
      </h3>
      <p className="text-[15px] leading-7 text-slate-600 mb-6">
        {service.description}
      </p>
      {service.points && service.points.length > 0 && (
        <ul className="space-y-3">
          {service.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#25a244] mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
