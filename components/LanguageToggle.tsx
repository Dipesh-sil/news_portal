'use client';

import { useLanguage } from '@/lib/language';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium transition-all hover:border-bk-blue hover:shadow-sm"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4 text-bk-blue" />
      <span className={language === 'en' ? 'font-bold text-bk-blue' : 'text-gray-400'}>EN</span>
      <span className="text-gray-300">|</span>
      <span className={`nepali-heading ${language === 'np' ? 'font-bold text-bk-blue' : 'text-gray-400'}`}>
        नेपाली
      </span>
    </button>
  );
}
