'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';

export default function Footer() {
  const { isNepali } = useLanguage();

  return (
    <footer className="mt-auto border-t border-gray-800 bg-bk-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">
              <span className="text-white">BULLET</span>{' '}
              <span className="text-bk-red">KHABAR</span>{' '}
              <span className="nepali-heading text-sm text-gray-400">
                <span className="text-gray-300">बुलेट</span>{' '}
                <span className="text-bk-red/80">खबर</span>
              </span>
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${isNepali ? 'nepali-text' : ''}`}>
              {isNepali
                ? 'नेपालको सबैभन्दा छिटो द्विभाषी समाचार प्लेटफर्म। तपाईंलाई चाहिने खबर, बुलेट पोइन्टमा।'
                : "Nepal's fastest bilingual news platform. News you need, in bullet points."}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              {isNepali ? 'वर्गहरू' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/nepal', en: 'Nepal', np: 'नेपाल' },
                { href: '/politics', en: 'Politics', np: 'राजनीति' },
                { href: '/world', en: 'World', np: 'विश्व' },
                { href: '/business', en: 'Business', np: 'व्यापार' },
                { href: '/sports', en: 'Sports', np: 'खेलकुद' },
                { href: '/tech', en: 'Technology', np: 'प्रविधि' },
              ].map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="transition-colors hover:text-white">
                    {isNepali ? cat.np : cat.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              {isNepali ? 'द्रुत लिंकहरू' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/remittance', en: 'Remittance Rates', np: 'विप्रेषण दर' },
                { href: '/jobs', en: 'Jobs', np: 'रोजगार' },
                { href: '/notices', en: 'Notices', np: 'सूचना' },
                { href: '/about', en: 'About Us', np: 'हाम्रो बारेमा' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {isNepali ? link.np : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              {isNepali ? 'सम्पर्क' : 'Connect'}
            </h4>
            <p className="text-sm">
              {isNepali ? 'इमेल' : 'Email'}: info@bulletkhabar.com.np
            </p>
            <p className="mt-1 text-sm">
              {isNepali ? 'काठमाडौं, नेपाल' : 'Kathmandu, Nepal'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Bullet Khabar बुलेट खबर. {isNepali ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
