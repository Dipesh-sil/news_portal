'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/language';

export type BannerPosition = 'article-top' | 'article-bottom' | 'sidebar' | 'homepage-mid' | 'header-below' | 'header-inline';

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  altText_np?: string;
  position: BannerPosition;
}

// Banners managed via Keystatic CMS at /keystatic → Banners collection
// For now, using placeholder data. Replace with CMS data in production.
const PLACEHOLDER_BANNERS: Record<BannerPosition, Banner | null> = {
  'article-top': {
    id: 'article-top-1',
    imageUrl: '/images/banners/ad-top.svg',
    linkUrl: '#',
    altText: 'Advertisement',
    altText_np: 'विज्ञापन',
    position: 'article-top',
  },
  'article-bottom': {
    id: 'article-bottom-1',
    imageUrl: '/images/banners/ad-bottom.svg',
    linkUrl: '#',
    altText: 'Advertisement',
    altText_np: 'विज्ञापन',
    position: 'article-bottom',
  },
  sidebar: {
    id: 'sidebar-1',
    imageUrl: '/images/banners/ad-sidebar.svg',
    linkUrl: '#',
    altText: 'Advertisement',
    altText_np: 'विज्ञापन',
    position: 'sidebar',
  },
  'homepage-mid': {
    id: 'homepage-mid-1',
    imageUrl: '/images/banners/ad-homepage.svg',
    linkUrl: '#',
    altText: 'Advertisement',
    altText_np: 'विज्ञापन',
    position: 'homepage-mid',
  },
  'header-below': {
    id: 'header-below-1',
    imageUrl: '/images/banners/ad-header.svg',
    linkUrl: '#',
    altText: 'Advertisement',
    altText_np: 'विज्ञापन',
    position: 'header-below',
  },
  'header-inline': {
    id: 'header-inline-1',
    imageUrl: '/images/banners/ad-header-inline.svg',
    linkUrl: '#',
    altText: 'Advertisement',
    altText_np: 'विज्ञापन',
    position: 'header-inline',
  },
};

interface AdBannerProps {
  position: BannerPosition;
  className?: string;
}

export default function AdBanner({ position, className = '' }: AdBannerProps) {
  const { isNepali } = useLanguage();
  const banner = PLACEHOLDER_BANNERS[position];

  if (!banner) return null;

  const sizeMap: Record<BannerPosition, { width: number; height: number; aspect: string }> = {
    'article-top': { width: 728, height: 90, aspect: 'aspect-[728/90]' },
    'article-bottom': { width: 728, height: 90, aspect: 'aspect-[728/90]' },
    sidebar: { width: 300, height: 250, aspect: 'aspect-[300/250]' },
    'homepage-mid': { width: 970, height: 90, aspect: 'aspect-[970/90]' },
    'header-below': { width: 970, height: 90, aspect: 'aspect-[970/90]' },
    'header-inline': { width: 468, height: 60, aspect: 'aspect-[468/60]' },
  };

  const size = sizeMap[position];
  const alt = isNepali && banner.altText_np ? banner.altText_np : banner.altText;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <a
          href={banner.linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group inline-block"
        >
          <div
            className={`${size.aspect} relative overflow-hidden rounded-lg border border-dashed border-gray-200 bg-gray-50 transition-shadow hover:shadow-sm`}
            style={{ width: '100%', maxWidth: size.width }}
          >
            {/* Placeholder — replace with real banner image */}
            <div className="flex h-full min-h-[60px] w-full items-center justify-center px-4">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {isNepali ? 'विज्ञापन' : 'Advertisement'}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-300">
                  {size.width} x {size.height}
                </p>
              </div>
            </div>
          </div>
        </a>
        <p className="mt-1 text-[10px] text-gray-300">
          {isNepali ? 'विज्ञापन' : 'Ad'}
        </p>
      </div>
    </div>
  );
}
