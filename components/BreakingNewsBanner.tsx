'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface Props {
  textEn: string;
  textNp: string;
}

export default function BreakingNewsBanner({ textEn, textNp }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const { isNepali } = useLanguage();

  if (dismissed) return null;

  return (
    <div className="relative flex items-center overflow-hidden bg-bk-red text-white">
      <div className="flex shrink-0 items-center gap-1.5 bg-red-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
        <AlertTriangle className="h-3.5 w-3.5" />
        {isNepali ? 'ब्रेकिंग' : 'BREAKING'}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className={`animate-ticker whitespace-nowrap py-1.5 text-sm font-medium ${isNepali ? 'nepali-heading' : ''}`}>
          {isNepali ? textNp : textEn}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 cursor-pointer px-2 py-1 transition-opacity hover:opacity-70"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
