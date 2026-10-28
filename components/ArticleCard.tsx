'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { formatADDate } from '@/lib/dates';

const CATEGORY_COLORS: Record<string, string> = {
  politics: 'bg-red-100 text-red-700',
  world: 'bg-blue-100 text-blue-700',
  nepal: 'bg-green-100 text-green-700',
  business: 'bg-orange-100 text-orange-700',
  sports: 'bg-purple-100 text-purple-700',
  tech: 'bg-cyan-100 text-cyan-700',
};

const CATEGORY_LABELS: Record<string, { en: string; np: string }> = {
  politics: { en: 'Politics', np: 'राजनीति' },
  world: { en: 'World', np: 'विश्व' },
  nepal: { en: 'Nepal', np: 'नेपाल' },
  business: { en: 'Business', np: 'व्यापार' },
  sports: { en: 'Sports', np: 'खेलकुद' },
  tech: { en: 'Technology', np: 'प्रविधि' },
};

interface Props {
  slug: string;
  title: string;
  title_np: string;
  date: string;
  date_bs: string;
  category: string;
  summary: string;
  summary_np: string;
  image: string;
  readTime: number;
}

export default function ArticleCard({
  slug, title, title_np, date, date_bs, category, summary, summary_np, image, readTime,
}: Props) {
  const { isNepali } = useLanguage();
  const bullets = (isNepali ? summary_np : summary).split('|').filter(Boolean);
  const catColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
  const catLabel = CATEGORY_LABELS[category] || { en: category, np: category };

  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={isNepali ? title_np : title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-xs font-semibold ${catColor}`}>
            {isNepali ? catLabel.np : catLabel.en}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={`text-lg font-bold leading-tight text-gray-900 group-hover:text-bk-blue ${isNepali ? 'nepali-heading' : ''}`}>
            {isNepali ? title_np : title}
          </h3>

          {/* TL;DR bullets */}
          {bullets.length > 0 && (
            <ul className={`mt-2 space-y-1 ${isNepali ? 'nepali-text text-sm' : 'text-sm text-gray-600'}`}>
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-bk-blue" />
                  {b.trim()}
                </li>
              ))}
            </ul>
          )}

          {/* Meta */}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
            <span>{isNepali ? date_bs : formatADDate(date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime} {isNepali ? 'मि.' : 'min'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
