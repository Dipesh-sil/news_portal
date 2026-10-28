'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import {
  Globe,
  Landmark,
  Briefcase,
  Gamepad2,
  Cpu,
  Flag,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

interface CategoryBannerItem {
  href: string;
  en: string;
  np: string;
  icon: LucideIcon;
  gradient: string;
  descriptionEn: string;
  descriptionNp: string;
}

const CATEGORIES: CategoryBannerItem[] = [
  {
    href: '/nepal',
    en: 'Nepal',
    np: 'नेपाल',
    icon: Flag,
    gradient: 'from-emerald-500 to-teal-600',
    descriptionEn: 'National news & updates',
    descriptionNp: 'राष्ट्रिय समाचार र अपडेट',
  },
  {
    href: '/politics',
    en: 'Politics',
    np: 'राजनीति',
    icon: Landmark,
    gradient: 'from-red-500 to-rose-600',
    descriptionEn: 'Political developments',
    descriptionNp: 'राजनीतिक घटनाक्रम',
  },
  {
    href: '/world',
    en: 'World',
    np: 'विश्व',
    icon: Globe,
    gradient: 'from-blue-500 to-indigo-600',
    descriptionEn: 'International affairs',
    descriptionNp: 'अन्तर्राष्ट्रिय मामिला',
  },
  {
    href: '/business',
    en: 'Business',
    np: 'व्यापार',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-600',
    descriptionEn: 'Economy & markets',
    descriptionNp: 'अर्थतन्त्र र बजार',
  },
  {
    href: '/sports',
    en: 'Sports',
    np: 'खेलकुद',
    icon: Gamepad2,
    gradient: 'from-violet-500 to-purple-600',
    descriptionEn: 'Sports coverage',
    descriptionNp: 'खेलकुद समाचार',
  },
  {
    href: '/tech',
    en: 'Technology',
    np: 'प्रविधि',
    icon: Cpu,
    gradient: 'from-cyan-500 to-blue-600',
    descriptionEn: 'Tech innovations',
    descriptionNp: 'प्रविधि समाचार',
  },
];

export default function CategoryBanners() {
  const { isNepali } = useLanguage();

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={`text-lg font-bold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}
        >
          {isNepali ? 'समाचार वर्ग' : 'News Categories'}
        </h2>
        <Link
          href="/"
          className={`text-sm font-medium text-bk-blue hover:underline ${isNepali ? 'nepali-heading' : ''}`}
        >
          {isNepali ? 'सबै हेर्नुहोस् →' : 'View All →'}
        </Link>
      </div>

      {/* Large Banner Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-4 text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90`}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-white/20 p-2 backdrop-blur-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className={`text-sm font-bold leading-tight ${isNepali ? 'nepali-heading' : ''}`}
                >
                  {isNepali ? cat.np : cat.en}
                </h3>
                <p
                  className={`mt-1 text-[10px] leading-tight opacity-90 ${isNepali ? 'nepali-text' : ''}`}
                >
                  {isNepali ? cat.descriptionNp : cat.descriptionEn}
                </p>
              </div>
              {/* Hover effect overlay */}
              <div className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
            </Link>
          );
        })}
      </div>

      {/* Big Featured Category Banner */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Featured Category 1 - Large Banner */}
        <Link
          href="/politics"
          className="group relative flex h-32 items-center overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-rose-700 p-6 shadow-md transition-all hover:shadow-lg"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
              <Landmark className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold text-white ${isNepali ? 'nepali-heading' : ''}`}
              >
                {isNepali ? 'राजनीति' : 'Politics'}
              </h3>
              <p className="text-sm text-white/80">
                {isNepali
                  ? 'सबैभन्दा ताजा राजनीतिक समाचार'
                  : 'Latest political updates'}
              </p>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent" />
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5" />
        </Link>

        {/* Featured Category 2 - Large Banner */}
        <Link
          href="/sports"
          className="group relative flex h-32 items-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 p-6 shadow-md transition-all hover:shadow-lg"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold text-white ${isNepali ? 'nepali-heading' : ''}`}
              >
                {isNepali ? 'खेलकुद' : 'Sports'}
              </h3>
              <p className="text-sm text-white/80">
                {isNepali
                  ? 'खेलकुद समाचार र अपडेट'
                  : 'Sports news & updates'}
              </p>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent" />
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5" />
        </Link>
      </div>
    </section>
  );
}
