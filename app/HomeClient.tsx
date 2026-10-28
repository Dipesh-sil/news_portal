'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import { formatADDate } from '@/lib/dates';
import ArticleCard from '@/components/ArticleCard';
import RemittanceWidget from '@/components/RemittanceWidget';
import LoadSheddingWidget from '@/components/LoadSheddingWidget';
import BreakingNewsBanner from '@/components/BreakingNewsBanner';
import AdBanner from '@/components/AdBanner';
import CategoryBanners from '@/components/CategoryBanners';
import type { Post } from '@/lib/posts';

const CATEGORIES = [
  { value: 'all', en: 'All', np: 'सबै' },
  { value: 'nepal', en: 'Nepal', np: 'नेपाल' },
  { value: 'politics', en: 'Politics', np: 'राजनीति' },
  { value: 'world', en: 'World', np: 'विश्व' },
  { value: 'business', en: 'Business', np: 'व्यापार' },
  { value: 'sports', en: 'Sports', np: 'खेलकुद' },
  { value: 'tech', en: 'Technology', np: 'प्रविधि' },
];

interface Props {
  posts: Post[];
  featured: Post | null;
}

export default function HomeClient({ posts, featured }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { isNepali } = useLanguage();

  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      <BreakingNewsBanner
        textEn="Stay updated with Bullet Khabar — Nepal's fastest bilingual news platform"
        textNp="बुलेट खबरसँग अपडेट रहनुहोस् — नेपालको सबैभन्दा छिटो द्विभाषी समाचार"
      />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero / Featured */}
        {featured && (
          <Link href={`/article/${featured.slug}`} className="group mb-8 block">
            <div className="relative overflow-hidden rounded-xl bg-gray-900">
              <div className="relative aspect-[2.2/1] sm:aspect-[3/1]">
                <Image
                  src={featured.image}
                  alt={isNepali ? featured.title_np : featured.title}
                  fill
                  className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                  priority
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8">
                <span className="mb-2 w-fit rounded bg-bk-red px-2 py-0.5 text-xs font-bold uppercase text-white">
                  {isNepali ? 'मुख्य खबर' : 'Top Story'}
                </span>
                <h1
                  className={`text-2xl font-extrabold leading-tight text-white sm:text-4xl ${isNepali ? 'nepali-heading' : ''}`}
                >
                  {isNepali ? featured.title_np : featured.title}
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  {isNepali ? featured.date_bs : formatADDate(featured.date)}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* AD SLOT: Below Hero (970x90 Billboard) */}
        <AdBanner position="header-below" className="mb-6" />

        {/* Category Banners Section - NEW */}
        <CategoryBanners />

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? 'bg-bk-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } ${isNepali ? 'nepali-heading' : ''}`}
            >
              {isNepali ? cat.np : cat.en}
            </button>
          ))}
        </div>

        {/* Big Category Banner Ad - Between tabs and content */}
        <AdBanner position="homepage-mid" className="mb-6" />

        {/* Main grid + Sidebar */}
        <div className="flex gap-8">
          {/* Articles Grid */}
          <div className="flex-1">
            {/* Articles with inline ads */}
            <div className="space-y-8">
              {/* First row of articles (6 items) */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(0, 6).map((post) => (
                  <ArticleCard key={post.slug} {...post} />
                ))}
              </div>

              {/* Inline Ad Banner after first 6 articles */}
              {filtered.length > 6 && (
                <AdBanner position="homepage-mid" />
              )}

              {/* Second row of articles (next 6 items) */}
              {filtered.length > 6 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.slice(6, 12).map((post) => (
                    <ArticleCard key={post.slug} {...post} />
                  ))}
                </div>
              )}

              {/* Another Inline Ad Banner after next 6 articles */}
              {filtered.length > 12 && (
                <AdBanner position="homepage-mid" />
              )}

              {/* Remaining articles */}
              {filtered.length > 12 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.slice(12).map((post) => (
                    <ArticleCard key={post.slug} {...post} />
                  ))}
                </div>
              )}
            </div>

            {filtered.length === 0 && (
              <p className={`py-12 text-center text-gray-400 ${isNepali ? 'nepali-text' : ''}`}>
                {isNepali ? 'यस वर्गमा कुनै लेख छैन।' : 'No articles in this category yet.'}
              </p>
            )}
          </div>

          {/* Sidebar (desktop) */}
          <aside className="hidden w-72 shrink-0 space-y-6 lg:block">
            {/* AD SLOT: Sidebar (300x250 Medium Rectangle) */}
            <AdBanner position="sidebar" />

            <RemittanceWidget />
            <LoadSheddingWidget />

            {/* Trending */}
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className={`mb-3 text-sm font-bold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
                {isNepali ? 'ट्रेन्डिङ' : 'Trending'}
              </h3>
              <ol className="space-y-3">
                {posts.slice(0, 5).map((post, i) => (
                  <li key={post.slug}>
                    <Link href={`/article/${post.slug}`} className="group flex gap-3">
                      <span className="text-lg font-bold text-bk-blue">{i + 1}</span>
                      <span
                        className={`text-sm font-medium text-gray-700 group-hover:text-bk-blue ${isNepali ? 'nepali-heading' : ''}`}
                      >
                        {isNepali ? post.title_np : post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
