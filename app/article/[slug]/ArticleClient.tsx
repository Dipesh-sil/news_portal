'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import { formatADDate } from '@/lib/dates';
import TLDRBox from '@/components/TLDRBox';
import ShareButtons from '@/components/ShareButtons';
import ArticleCard from '@/components/ArticleCard';
import { Clock, User, Tag } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import type { Post } from '@/lib/posts';

const CATEGORY_LABELS: Record<string, { en: string; np: string }> = {
  politics: { en: 'Politics', np: 'राजनीति' },
  world: { en: 'World', np: 'विश्व' },
  nepal: { en: 'Nepal', np: 'नेपाल' },
  business: { en: 'Business', np: 'व्यापार' },
  sports: { en: 'Sports', np: 'खेलकुद' },
  tech: { en: 'Technology', np: 'प्रविधि' },
};

interface Props {
  post: Post;
  related: Post[];
}

export default function ArticleClient({ post, related }: Props) {
  const { isNepali } = useLanguage();
  const title = isNepali ? post.title_np : post.title;
  const content = isNepali ? post.content_np : post.content;
  const catLabel = CATEGORY_LABELS[post.category] || { en: post.category, np: post.category };
  const siteUrl = typeof window !== 'undefined' ? window.location.href : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    inLanguage: ['ne', 'en'],
    datePublished: `${post.date}T06:00:00+05:45`,
    dateModified: `${post.date}T06:00:00+05:45`,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Bullet Khabar',
      url: 'https://bulletkhabar.com.np',
    },
    description: post.summary.split('|')[0],
    articleSection: post.category,
    image: post.image,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="inline-block rounded bg-bk-blue px-2.5 py-0.5 text-xs font-semibold text-white">
            {isNepali ? catLabel.np : catLabel.en}
          </span>
          <h1 className={`mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl ${isNepali ? 'nepali-heading' : ''}`}>
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span>{isNepali ? post.date_bs : formatADDate(post.date)}</span>
            {!isNepali && post.date_bs && (
              <span className="nepali-heading text-xs text-gray-400">({post.date_bs})</span>
            )}
            {isNepali && (
              <span className="text-xs text-gray-400">({formatADDate(post.date)})</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} {isNepali ? 'मिनेट' : 'min read'}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative mb-6 aspect-video overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={post.image}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {/* AD SLOT: Article Top (728x90 Leaderboard) */}
        <AdBanner position="article-top" className="mb-6" />

        {/* TL;DR */}
        <div className="mb-6">
          <TLDRBox summaryEn={post.summary} summaryNp={post.summary_np} />
        </div>

        {/* Share */}
        <div className="mb-6">
          <ShareButtons url={siteUrl} title={title} />
        </div>

        {/* Article Body */}
        <div
          className={`prose prose-lg max-w-[720px] prose-headings:font-bold prose-a:text-bk-blue ${
            isNepali ? 'nepali-text' : ''
          }`}
        >
          {content.split('\n').map((paragraph, i) => {
            if (!paragraph.trim()) return null;
            if (paragraph.startsWith('## ')) {
              return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>

        {/* Tags */}
        <div className="mt-8 flex items-center gap-2 border-t border-gray-100 pt-6">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {isNepali ? catLabel.np : catLabel.en}
          </span>
        </div>

        {/* Share bottom */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <ShareButtons url={siteUrl} title={title} />
        </div>

        {/* AD SLOT: Article Bottom (728x90 Leaderboard) */}
        <AdBanner position="article-bottom" className="mt-8" />
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <h2 className={`mb-4 text-xl font-bold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
            {isNepali ? 'सम्बन्धित लेखहरू' : 'Related Articles'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.slug} {...r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
