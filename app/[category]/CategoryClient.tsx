'use client';

import { useLanguage } from '@/lib/language';
import ArticleCard from '@/components/ArticleCard';
import type { Post } from '@/lib/posts';

interface Props {
  posts: Post[];
  categoryEn: string;
  categoryNp: string;
}

export default function CategoryClient({ posts, categoryEn, categoryNp }: Props) {
  const { isNepali } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className={`mb-6 text-3xl font-extrabold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
        {isNepali ? categoryNp : categoryEn}
        <span className={`ml-2 text-lg font-normal text-gray-400 ${isNepali ? '' : 'nepali-heading'}`}>
          {isNepali ? `(${categoryEn})` : `(${categoryNp})`}
        </span>
      </h1>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <p className={`py-16 text-center text-gray-400 ${isNepali ? 'nepali-text' : ''}`}>
          {isNepali
            ? 'यस वर्गमा अहिलेसम्म कुनै लेख छैन।'
            : 'No articles in this category yet.'}
        </p>
      )}
    </div>
  );
}
