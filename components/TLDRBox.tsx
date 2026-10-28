'use client';

import { ListChecks } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface Props {
  summaryEn: string;
  summaryNp: string;
}

export default function TLDRBox({ summaryEn, summaryNp }: Props) {
  const { isNepali } = useLanguage();
  const bullets = (isNepali ? summaryNp : summaryEn).split('|').filter(Boolean);

  if (bullets.length === 0) return null;

  return (
    <div className="rounded-lg border-l-4 border-bk-blue bg-blue-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-bk-blue">
        <ListChecks className="h-4 w-4" />
        {isNepali ? 'सारांश' : 'TL;DR'}
      </div>
      <ul className={`space-y-1.5 ${isNepali ? 'nepali-text' : 'text-sm text-gray-700'}`}>
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-bk-blue" />
            {b.trim()}
          </li>
        ))}
      </ul>
    </div>
  );
}
