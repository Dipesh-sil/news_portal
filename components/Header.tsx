'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import LanguageToggle from './LanguageToggle';
import AdBanner from './AdBanner';

const NAV_ITEMS = [
  { href: '/', en: 'Home', np: 'गृहपृष्ठ' },
  { href: '/nepal', en: 'Nepal', np: 'नेपाल' },
  { href: '/politics', en: 'Politics', np: 'राजनीति' },
  { href: '/world', en: 'World', np: 'विश्व' },
  { href: '/business', en: 'Business', np: 'व्यापार' },
  { href: '/sports', en: 'Sports', np: 'खेलकुद' },
  { href: '/tech', en: 'Technology', np: 'प्रविधि' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isNepali } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo + Banner Container */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="text-bk-dark">BULLET</span>{' '}
              <span className="text-bk-red">KHABAR</span>
            </span>
            <span className="nepali-heading text-xs sm:text-sm">
              <span className="text-bk-dark">बुलेट</span>{' '}
              <span className="text-bk-red">खबर</span>
            </span>
          </Link>
          
          {/* Inline Banner - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block">
            <AdBanner position="header-inline" />
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-bk-blue ${isNepali ? 'nepali-heading' : ''}`}
            >
              {isNepali ? item.np : item.en}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="cursor-pointer rounded-md p-1.5 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 ${isNepali ? 'nepali-heading' : ''}`}
            >
              {isNepali ? item.np : item.en}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
